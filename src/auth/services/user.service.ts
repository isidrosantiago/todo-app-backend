import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserCredentialsDto } from '../dto/user-credentials.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userCredentialsDto: UserCredentialsDto) {
    const { username, password } = userCredentialsDto;

    return this.databaseService.user.create({
      data: {
        username,
        password,
      },
    });
  }

  async findOne(username: string) {
    return this.databaseService.user.findUnique({
      where: {
        username,
      },
    });
  }
}
