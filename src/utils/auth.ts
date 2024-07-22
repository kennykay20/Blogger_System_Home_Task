import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { Logger } from '@nestjs/common';

export class Authentication {
  static generateSalt(): string {
    return crypto.randomBytes(49).toString('hex');
  }

  static generatePasswordHash(value: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(value).digest('hex');
  }

  static comparePassword(
    plainPassword: string,
    hash: string,
    salt: string,
  ): boolean {
    const newHash = this.generatePasswordHash(plainPassword, salt);
    return newHash === hash ? true : false;
  }

  static hashPassword = async (password: string) => {
    try {
      return await argon2.hash(password);
    } catch (error) {
      Logger.error(error, 'Error hashing password:');
      throw new Error('Failed to hash password');
    }
  };

  static verifyHashPassword = async (hash: any, password: string) => {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      Logger.error(error, 'Error verifying password:');
      throw new Error('Failed to verify password');
    }
  };
}