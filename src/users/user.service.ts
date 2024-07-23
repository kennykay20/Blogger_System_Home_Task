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
      console.log('inside the get users service');
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
      console.log('request.user ', req.user);
      console.log('request.headers ', req.headers);
      const decodedUser = req.user as { id: number; username: string };
      console.log('decode ', decodedUser);
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
}
