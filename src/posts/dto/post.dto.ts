import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostDTO {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsNumber()
  public userId: number;
}
