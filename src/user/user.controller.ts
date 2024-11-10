import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ excludePrefixes: ['password'] })
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ excludePrefixes: ['password'] })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException(errorMessages.invalidId);
    }

    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(errorMessages.notFound('User'));
    }

    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ excludePrefixes: ['password'] })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ excludePrefixes: ['password'] })
  @Put(':id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!isUuid(id)) {
      throw new BadRequestException(errorMessages.invalidId);
    }
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    if (!isUuid(id)) {
      throw new BadRequestException(errorMessages.invalidId);
    }

    this.userService.remove(id);
  }
}
