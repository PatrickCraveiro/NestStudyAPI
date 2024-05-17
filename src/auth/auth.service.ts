import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private userService: UserService,
  ) {}

  createToken(user: User) {
    return {
      token: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '5 days',
          subject: String(user.id),
        },
      ),
    };
  }

  checkToken(token: string) {
    console.log(token, 'token');
    try {
      const data = this.jwtService.verify(token);

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('O email digitado não existe');
    }

    return true;
  }

  async reset(password: string, token: any) {
    const user = await this.prisma.user.update({
      where: {
        id: token,
      },
      data: {
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('O email digitado não existe');
    }

    return this.createToken(user);
  }

  async register(data: CreateUserDTO) {
    const user = (await this.userService.create(data)) as any;

    return this.createToken(user);
  }
}
