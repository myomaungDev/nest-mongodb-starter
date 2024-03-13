import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthelpersService {
  async hashPassword(password: string): Promise<string> {
    try {
      const salt =  bcrypt.genSaltSync(10)
      const hash =  bcrypt.hashSync(password, salt);
      return hash;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
