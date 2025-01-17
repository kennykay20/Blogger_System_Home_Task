import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { isValidEmail, isValidPassword } from '../utils/helpers';
import { Authentication } from '../utils/auth';
import { Users } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(userDto: UserDTO) {
    const { username, email, password, firstname, lastname } = userDto;
    try {
      if (!username) {
        throw new ForbiddenException('Please enter username');
      }
      const existUser = await this.getUser(username);
      if (!email) {
        throw new ForbiddenException('Please enter an email');
      }
      if (existUser) {
        throw new BadRequestException('Username already exist');
      }
      if (email && !isValidEmail(email)) {
        throw new BadRequestException('Invalid email address supplied');
      }

      const existEmail = await this.getUserByEmail(email);
      if (existEmail) {
        throw new BadRequestException('Email already exist');
      }

      if (!password) {
        throw new BadRequestException('Please enter a password');
      }
      if (password && !isValidPassword(password)) {
        throw new BadRequestException(
          'Password must be at least 5 characters with 1 uppercase',
        );
      }

      const hashPassword = await Authentication.hashPassword(password);

      await this.prisma.users.create({
        data: {
          email,
          hashedpassword: hashPassword,
          username,
          firstname,
          lastname,
        },
      });

      return { message: 'create user successfully' };
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getUsers() {
    try {
      const users = await this.prisma.users.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstname: true,
          lastname: true,
          createdAt: true,
        },
      });
      return users;
    } catch (error) {
      Logger.log(`error fetching users ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  async getUser(username: string): Promise<Users> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          username,
        },
      });
      return user;
    } catch (error) {
      Logger.log(error);
      throw new Error(error);
    }
  }

  async getUserByEmail(email: string): Promise<Users> {
    try {
      const result = await this.prisma.users.findUnique({
        where: {
          email,
        },
      });
      return result;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getUserById(id: number, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      const user = await this.findUserData(id, decodedUser);
      return user;
    } catch (error) {
      Logger.log(`error fetching user with id ${id}`);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async getRegisteredUser(username: string, hash: string): Promise<any> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          username,
          hashedpassword: hash,
        },
      });
      return user;
    } catch (error) {
      Logger.log(error);
      throw new Error(error);
    }
  }

  async findUserData(id: number, decodedUser: { id: number }) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`user not found`);
    }
    if (user && user.id !== decodedUser.id) {
      throw new NotFoundException(`not the right login user`);
    }
    return user;
  }

  async updateUser(id: number, data: UpdateUserDTO, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      await this.findUserData(id, decodedUser);
      const result = await this.prisma.users.update({
        where: { id },
        data,
      });
      delete result.hashedpassword;
      return { message: 'User updated successfully', result };
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async deleteUser(id: number, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      await this.findUserData(id, decodedUser);
      const result = await this.prisma.users.delete({
        where: { id },
      });
      return { message: 'User deleted successfully', result };
    } catch (error) {
      Logger.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
