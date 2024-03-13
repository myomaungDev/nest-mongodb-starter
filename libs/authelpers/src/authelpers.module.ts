import { Module } from '@nestjs/common';
import { AuthelpersService } from './authelpers.service';

@Module({
  providers: [AuthelpersService],
  exports: [AuthelpersService],
})
export class AuthelpersModule {}
