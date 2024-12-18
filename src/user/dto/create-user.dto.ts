import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: `User's login` })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: `User's password` })
  @IsString()
  @IsNotEmpty()
  password: string;
}
