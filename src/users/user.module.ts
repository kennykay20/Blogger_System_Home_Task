import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { PrismaModule } from 'prisma/prisma.module';
import { JwtStrategy } from '../guards/jwt.strategy';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../guards/auth.guards';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
