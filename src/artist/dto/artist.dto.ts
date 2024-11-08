import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
