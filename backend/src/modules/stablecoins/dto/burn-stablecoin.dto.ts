import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for burning stablecoins and returning funds via on-chain or off-chain methods
 *
 * Based on LOGGING_EXAMPLE.md Example 3 and 6
 */
export class BurnStablecoinDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Stablecoin ID to burn tokens from',
  })
  @IsString()
  stablecoinId: string;

  @ApiProperty({
    example: 'APBRL',
    description: 'Currency code of the stablecoin being burned',
  })
  @IsString()
  currencyCode: string;

  @ApiProperty({
    example: 500.00,
    description: 'Amount in BRL to burn',
  })
  @IsNumber()
  amountBrl: number;

  @ApiProperty({
    example: 'RLUSD',
    enum: ['RLUSD', 'PIX'],
    description: 'Asset to return to client: RLUSD for on-chain or PIX for off-chain',
  })
  @IsEnum(['RLUSD', 'PIX'])
  returnAsset: 'RLUSD' | 'PIX';

  @ApiProperty({
    example: 'rClientOnChainWallet...',
    description: 'Client wallet address (for on-chain returns)',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientWallet?: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'Client CPF (for PIX off-chain returns, required if returnAsset=PIX)',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientCpf?: string;

  @ApiProperty({
    example: 'https://webhook.acme.com/fountain',
    description: 'Webhook URL for operation completion notification',
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string;
}
