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
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '../guards/auth.guards';
import { JwtAuthGuard } from '../guards/jwt.guards';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private userSvc: UserService) {}

  @Post('register')
  RegisterUser(@Body() userDto: UserDTO) {
    return this.userSvc.createUser(userDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async GetUsers() {
    return await this.userSvc.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async GetUser(@Param() params: { id: any }, @Req() req) {
    return await this.userSvc.getUserById(+params.id, req);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() data: UpdateUserDTO, @Req() req) {
    return this.userSvc.updateUser(+id, data, req);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() req) {
    return this.userSvc.deleteUser(+id, req);
  }
}
