import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { AuthResponse } from '../types/auth-response.interface';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<AuthResponse> {
    const { username, password } = userCredentialsDto;

    const userExists = await this.usersService.findOne(username);

    if (userExists) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return this.buildAuthResponse(user, 'User created successfully');
  }

  async signIn(userCredentialsDto: UserCredentialsDto): Promise<AuthResponse> {
    const { username, password } = userCredentialsDto;

    const userDB = await this.usersService.findOne(username);

    if (!userDB) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await this.comparePassword(password, userDB.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(userDB, 'User signed in successfully');
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private generateJwt(user: User) {
    const { id, username, status } = user;
    return this.jwtService.sign({ id, username, status });
  }

  private buildAuthResponse(data: User, message: string): AuthResponse {
    return {
      message,
      data: {
        id: data.id,
        username: data.username,
        token: this.generateJwt(data),
      },
    };
  }
}
