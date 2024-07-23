import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDTO {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsString()
  public content: string;
}
