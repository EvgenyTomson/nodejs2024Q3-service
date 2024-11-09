import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Album title' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Album release year' })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ description: `Album author's ID` })
  @IsUUID()
  @IsOptional()
  artistId: string | null;
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
