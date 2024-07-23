import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDTO {
  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  @IsOptional()
  public content: string;
}
