import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsOptional()
  @IsString()
  public username: string;

  @IsString()
  @IsOptional()
  public firstname: string;

  @IsString()
  @IsOptional()
  public lastname: string;
}
