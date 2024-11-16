import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { errorMessages } from '../helpers/constants';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(errorMessages.notFound('User'));
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      },
    });
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(errorMessages.notFound('User'));
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(errorMessages.incorrectOldPassword);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: currentTimestamp,
        // updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(errorMessages.notFound('User'));

    await this.prisma.user.delete({ where: { id } });
  }
}
