import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostDTO } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(postData: PostDTO) {
    const { content, title, userId } = postData;
    try {
      await this.prisma.posts.create({
        data: {
          content,
          title,
          userId,
        },
      });
      return { message: 'Post added successfully' };
    } catch (error) {
      Logger.log(error);
    }
  }

  async findAllPosts() {
    return this.prisma.posts.findMany();
  }

  async findPostById(id: number) {
    return this.prisma.posts.findUnique({
      where: { id },
    });
  }

  async updatePost(id: number, data: PostDTO) {
    return this.prisma.posts.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: number) {
    return this.prisma.posts.delete({
      where: { id },
    });
  }
}
