import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 45, { message: 'password has to be between 3 and 45 chars' })
  public password: string;

  @IsString()
  public firstname: string;

  @IsString()
  public lastname: string;
}
