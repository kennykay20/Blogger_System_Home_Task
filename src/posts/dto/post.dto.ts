import { IsNotEmpty, IsString } from 'class-validator';

export class PostDTO {
  @IsNotEmpty()
  public title: string;

  @IsString()
  public content: string;

  public userId: number;
}
