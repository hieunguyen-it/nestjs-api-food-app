import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { getUser } from 'src/auth/decorator';
import { MyJwtGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@getUser() user: User) {
    return user;
  }
}
