import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { configs } from './config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: configs.secret,
      signOptions: { expiresIn: '365d' },
    }),
  ],
})
export class AppModule {}
