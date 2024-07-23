import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '../guards/auth.guards';
import { JwtAuthGuard } from '../guards/jwt.guards';

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
}
