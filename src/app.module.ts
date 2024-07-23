import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { configs } from './config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: configs.secret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [JwtService],
})
export class AppModule {}
