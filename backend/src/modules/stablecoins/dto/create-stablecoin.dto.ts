import { IsString, IsEmail, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStablecoinDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Tokenizer ID',
  })
  @IsUUID()
  tokenizerId: string;

  @ApiProperty({
    example: 'client_123',
    description: 'Unique client identifier',
  })
  @IsString()
  clientId: string;

  @ApiProperty({
    example: 'Acme Corp BRL Account',
    description: 'Stablecoin account name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr',
    description: 'Client XRPL wallet address',
  })
  @IsString()
  clientWallet: string;

  @ApiProperty({
    example: 'https://webhook.acme.com/fountain',
    description: 'Webhook URL for notifications',
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({
    example: { documentId: '12345678901234', legalName: 'Acme Corp Ltd' },
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
