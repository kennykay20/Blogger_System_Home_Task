import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostDTO } from './dto/post.dto';
import { Request } from 'express';
import { UserService } from 'src/users/user.service';
import { UpdatePostDTO } from './dto/update.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private userSvc: UserService,
  ) {}

  async createPost(postData: PostDTO, req: Request) {
    const { content, title, userId } = postData;
    const decodedUser = req.user as { id: number; username: string };
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      if (user && user.id !== decodedUser.id) {
        throw new NotFoundException(`Unauthorized to post a content`);
      }
      await this.prisma.posts.create({
        data: {
          content,
          title,
          userId: decodedUser.id,
        },
      });
      return { message: 'Post added successfully' };
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

  async findAllPosts() {
    try {
      const posts = await this.prisma.posts.findMany();
      return posts;
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

  async findPostById(id: number, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      const post = await this.findPostData(id, decodedUser);
      return post;
    } catch (error) {
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

  async updatePost(id: number, data: UpdatePostDTO, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      await this.findPostData(id, decodedUser);
      const result = await this.prisma.posts.update({
        where: { id },
        data,
      });
      return { message: 'Post updated successfully', result };
    } catch (error) {
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

  async deletePost(id: number, req: Request) {
    try {
      const decodedUser = req.user as { id: number; username: string };
      await this.findPostData(id, decodedUser);
      const result = await this.prisma.posts.delete({
        where: { id },
      });
      return { message: 'Post deleted successfully', result };
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

  async findPostData(id: number, decodedUser: { id: number }) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post not found with id ${id}`);
    }
    if (post && post.userId !== decodedUser.id) {
      throw new NotFoundException(`Unauthorized, not the right user`);
    }
    return post;
  }
}
