import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from '../guards/jwt.strategy';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
  exports: [PostService],
})
export class PostModule {}
