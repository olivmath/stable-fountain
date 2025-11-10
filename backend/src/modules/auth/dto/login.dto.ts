import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@fountain.io',
    description: 'User email address',
  })
  @IsEmail()
  email: string;
}
