import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, { message: 'Username must not contain spaces' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
