import { IsString, IsUUID, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStablecoinDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Company/Tokenizer ID',
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    example: '88995721-e29b-41d4-a716-446655440001',
    description: 'Unique client identifier',
  })
  @IsString()
  clientId: string;

  @ApiProperty({
    example: 'Park America Building',
    description: 'Client name',
  })
  @IsString()
  clientName: string;

  @ApiProperty({
    example: 'rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr',
    description: 'Company XRPL wallet address',
  })
  @IsString()
  companyWallet: string;

  @ApiProperty({
    example: 'https://webhook.parkamerica.com/client123',
    description: 'Webhook URL for notifications',
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({
    example: 'RLUSD',
    enum: ['RLUSD', 'PIX'],
    description: 'Deposit type: RLUSD for on-chain deposits, PIX for off-chain',
  })
  @IsEnum(['RLUSD', 'PIX'])
  depositType: 'RLUSD' | 'PIX';

  @ApiProperty({
    example: 'PABRL',
    description: 'Stablecoin currency code (e.g., PABRL for Park America BRL)',
  })
  @IsString()
  stableCode: string;

  @ApiProperty({
    example: 13000,
    description: 'Amount in BRL to mint',
  })
  @IsNumber()
  amount: number;
}
