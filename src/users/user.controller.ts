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

@Controller('api/v1/user')
export class UserController {
  constructor(private userSvc: UserService) {}

  @Post('register')
  RegisterUser(@Body() userDto: UserDTO) {
    return this.userSvc.createUser(userDto);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async GetUsers() {
    console.log('inside the getUsers route');
    return await this.userSvc.getUsers();
  }

  @Get(':id')
  async GetUser(@Param() params: { id: any }, @Req() req) {
    return await this.userSvc.getUserById(params.id, req);
  }
}
