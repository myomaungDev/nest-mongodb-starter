// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UsersService } from 'src/users/users.service';
import { AuthelpersService } from '@mmm/authelpers';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private authHelperService: AuthelpersService,
  ) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(
      { id: payload.id, username: payload.id, email: payload.email },
      { secret: process.env.JWT_SECRET },
    );
  }

  generateRefreshToken(payload: any): string {
    try {
      return this.jwtService.sign(
        { id: payload.id, username: payload.id, email: payload.email },
        {
          expiresIn: '7d',
          secret: process.env.JWT_SECRET,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      const { username, password } = loginAuthDto;
      const user = await this.userService.findByUserNameOrEmail(username);
      if (user) {
        const isMatch = await this.authHelperService.comparePassword(
          password,
          user.password,
        );
        if (isMatch) {
          return {
            status: 200,
            message: 'success',
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
          };
        } else {
          return {
            status: 404,
            message: `Your  credential is  wrong.`,
            accessToken: '',
            refreshToken: '',
          };
        }
      } else {
        return {
          status: 404,
          message: 'Please check  your  username  or  email.',
          accessToken: '',
          refreshToken: '',
        };
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signup(signupDto: SignupAuthDto): Promise<{
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      return {
        status: 200,
        message: 'success',
        accessToken: '',
        refreshToken: '',
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
