import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: `User's old password` })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: `User's new password` })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
