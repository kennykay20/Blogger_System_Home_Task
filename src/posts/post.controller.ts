import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './dto/post.dto';
import { AuthGuard } from '../guards/auth.guards';
import { UpdatePostDTO } from './dto/update.dto';

@UseGuards(AuthGuard)
@Controller('api/v1/posts')
export class PostController {
  constructor(private postSvc: PostService) {}

  @Post()
  PostBlog(@Body() postDto: PostDTO, @Req() req) {
    return this.postSvc.createPost(postDto, req);
  }

  @Get()
  GetAllBlog() {
    return this.postSvc.findAllPosts();
  }

  @Get(':id')
  GetBlog(@Param('id') id: string, @Req() req) {
    return this.postSvc.findPostById(+id, req);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() data: UpdatePostDTO, @Req() req) {
    return this.postSvc.updatePost(+id, data, req);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() req) {
    return this.postSvc.deletePost(+id, req);
  }
}
