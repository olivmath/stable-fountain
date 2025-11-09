import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockchainDto {
  @ApiProperty({
    example: 'xahau',
    enum: ['xahau', 'testnet', 'mainnet'],
    description: 'Blockchain network',
  })
  @IsString()
  network: string;

  @ApiProperty({
    example: 'wss://xahau-test.xrpl-labs.com',
    description: 'WebSocket URL for blockchain',
  })
  @IsUrl()
  websocketUrl: string;

  @ApiProperty({
    example: 'rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr',
    description: 'Hook account address',
  })
  @IsString()
  hookAccount: string;

  @ApiProperty({
    example: 'sEd7rBGm5kxzauRTAV2hbsa7qJ8LQFQM9KM',
    description: 'Hook account secret (seed)',
  })
  @IsString()
  hookSecret: string;

  @ApiProperty({
    example: 'rN7n7otQDd6FczFgLdcqpHnZc5LiMvMPAr',
    description: 'Oracle account address',
    required: false,
  })
  @IsOptional()
  @IsString()
  oracleAccount?: string;
}
