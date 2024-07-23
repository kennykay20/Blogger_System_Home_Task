import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { configs } from './config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuthGuard } from './guards/auth.guards';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: configs.secret,
      signOptions: { expiresIn: '180s' },
    }),
  ],
})
export class AppModule {}
