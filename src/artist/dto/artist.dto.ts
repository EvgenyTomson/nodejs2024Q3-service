import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ description: `Artist's name` })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Does the artist have a Grammy?' })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
