import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenizerDto {
  @ApiProperty({ example: 'ABToken', description: 'Tokenizer name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contato@abtoken.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'starter',
    enum: ['starter', 'pro', 'enterprise'],
    description: 'Subscription tier',
  })
  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @ApiProperty({
    example: { website: 'https://abtoken.com', cnpj: '00.000.000/0000-00' },
    description: 'Additional metadata',
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
