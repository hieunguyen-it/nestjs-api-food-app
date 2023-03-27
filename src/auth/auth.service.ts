import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(authDTO: AuthDTO) {
    // hashPassword
    const hashPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashPassword: hashPassword,
          firstName: '',
          lastName: '',
        },
        // chỉ cho phép hiện thị các trường được chỉ định select
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
        // rằng buộc mỗi email là phải là duy nhất
        // tạo mới bản ghi khi client gửi requestß
      });
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'User with this email address already exists',
        );
      }
    }
  }

  // Login User
  async login(authDTO: AuthDTO) {
    try {
      // find user by input email
      const user = await this.prismaService.user.findUnique({
        where: {
          email: authDTO.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const passwordMatched = await argon.verify(
        user.hashPassword,
        authDTO.password,
      );

      if (!passwordMatched) {
        throw new ForbiddenException('Incorrect password');
      }

      delete user.hashPassword;
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      return {
        error,
      };
    }
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
