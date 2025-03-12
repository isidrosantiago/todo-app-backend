import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly username: string;

  @IsString()
  @MinLength(5)
  readonly password: string;
}
