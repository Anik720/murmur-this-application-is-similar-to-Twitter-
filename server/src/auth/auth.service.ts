import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

async register(registerDto: RegisterDto) {
  const { username, email, password } = registerDto;

  const existingUser = await this.usersService.findByEmail(email);
  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await this.usersService.create({
    username,
    email,
    password: hashedPassword,
  });

  const access_token = this.generateToken(user); // ✅ no destructuring

  const { password: _, ...userWithoutPassword } = user;

  return {
    access_token,
    user: userWithoutPassword,
  };
}



async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.usersService.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const token = this.generateToken(user);
  const { password: _, ...userWithoutPassword } = user;

  return {
    access_token: token, // now just the string
    user: userWithoutPassword,
  };
}

private generateToken(user: any): string {
  const payload = { sub: user.id, email: user.email };
  return this.jwtService.sign(payload); // ✅ return token string only
}

}