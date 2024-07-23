import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './dto/post.dto';

@Controller('api/v1/posts')
export class PostController {
  constructor(private postSvc: PostService) {}

  @Post()
  PostBlog(@Body() postDto: PostDTO) {
    return this.postSvc.createPost(postDto);
  }

  @Get()
  GetAllBlog() {
    return this.postSvc.findAllPosts();
  }

  @Get(':id')
  GetBlog(@Param('id') id: string) {
    return this.postSvc.findPostById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: PostDTO) {
    return this.postSvc.updatePost(+id, data);
  }
}
