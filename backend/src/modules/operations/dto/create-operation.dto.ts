import { IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOperationDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Stablecoin ID',
  })
  @IsUUID()
  stablecoinId: string;

  @ApiProperty({
    example: 'mint',
    enum: ['mint', 'burn'],
    description: 'Operation type',
  })
  @IsEnum(['mint', 'burn'])
  type: string;

  @ApiProperty({
    example: 1000.50,
    description: 'BRL amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountBrl?: number;

  @ApiProperty({
    example: 100.5,
    description: 'XRP amount (in drops / 1e6)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountRlbrl?: number;

  @ApiProperty({
    example: 'PIX',
    description: 'Payment method used',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    example: 'req_12345',
    description: 'Deposit request ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  depositRequestId?: string;

  @ApiProperty({
    example: { cpf: '12345678901', account: 'xxxx' },
    description: 'Return destination details',
    required: false,
  })
  @IsOptional()
  returnDestination?: Record<string, any>;

  @ApiProperty({
    example: 'rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr',
    description: 'Burn wallet address',
    required: false,
  })
  @IsOptional()
  @IsString()
  burnWallet?: string;

  @ApiProperty({
    example: 'burn_memo_123',
    description: 'Burn transaction memo',
    required: false,
  })
  @IsOptional()
  @IsString()
  burnMemo?: string;
}
