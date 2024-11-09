import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ description: 'Title of the track' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: `Track author's ID` })
  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @ApiProperty({ description: `Track album's ID` })
  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @ApiProperty({ description: 'Track duration' })
  @IsInt()
  @IsNotEmpty()
  duration: number;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
