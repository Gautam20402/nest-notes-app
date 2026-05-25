import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const hashed_password = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      name: dto.name,
      username: dto.username,
      hashed_password,
    });

    await this.usersRepo.save(user);

    return { id: user.id, name: user.name, username: user.username };
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersRepo.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(dto.password, user.hashed_password);

    if (!isValid) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.jwtService.sign({ sub: String(user.id) });

    return { token };
  }
}
