import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  // exports: [PrismaService] mục đích để các modules khác có thể sử dụng chung.
  // và dùng @Global để thực thi hành động.
})
export class PrismaModule {}
