import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async register(authDTO: AuthDTO) {
    // hashPassword
    const hashPassword = await argon.hash(authDTO.password);

    // tạo mới bản ghi khi client gửi requestß
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
    });
    return user;
  }
  login() {
    return {
      message: 'Login a user',
    };
  }
}
