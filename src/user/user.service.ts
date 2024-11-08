import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserWithoutPassword } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): UserWithoutPassword[] {
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: string): UserWithoutPassword | undefined {
    const user = this.users.find((user) => user.id === id);
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto): UserWithoutPassword {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): UserWithoutPassword {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(errorMessages.notFound('User'));
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(errorMessages.incorrectOldPassword);
    }

    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  remove(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1)
      throw new NotFoundException(errorMessages.notFound('User'));

    this.users.splice(userIndex, 1);
  }
}
