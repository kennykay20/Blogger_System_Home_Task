import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { UserService } from '../users/user.service';
import { Authentication } from '../utils/auth';
import { Request, Response } from 'express';
import { configs } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private userSvc: UserService,
  ) {}

  async login(dto: AuthDTO, req: Request, res: Response) {
    const { username, password } = dto;
    try {
      if (!username || !password) {
        throw new BadRequestException('Please enter username or password');
      }
      const existUser = await this.userSvc.getUser(username);
      if (!existUser) {
        throw new BadRequestException('Username not found');
      }
      const isMatch = await Authentication.verifyHashPassword(
        existUser.hashedpassword,
        password,
      );

      if (isMatch) {
        Logger.log('Password matched');
        // sign in jwt
        const payload = {
          userId: existUser.id,
          username: existUser.username,
        };
        const accessToken = await this.signInToken(payload);
        if (!accessToken) {
          throw new ForbiddenException('Access token not generated');
        }
        res.cookie('blogger_auth', accessToken);
        res
          .status(200)
          .json({ message: 'login successfully', token: accessToken });
      } else {
        throw new BadRequestException('Password not match');
      }
    } catch (error) {
      Logger.log(error);
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('blogger_auth');
    return res.status(200).json({ message: 'Logout successfully' });
  }

  signInToken = async (args: { userId: any; username: string }) => {
    try {
      const payload = { id: args.userId, username: args.username };
      const accessToken = await this.jwt.signAsync(payload, {
        secret: configs.secret,
      });
      return accessToken;
    } catch (error) {
      Logger.error(error, 'Error generating Token:');
      throw new Error('Failed to generating Token');
    }
  };

  verifyToken = async (token: string) => {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: configs.secret,
      });
      return payload;
    } catch (error) {}
  };
}
