import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOracleDto {
  @ApiProperty({
    example: 'BACEN',
    enum: ['BACEN', 'FRANKFURTER'],
    description: 'Oracle source',
  })
  @IsString()
  source: string;

  @ApiProperty({
    example: 5.25,
    description: 'USD to BRL exchange rate',
  })
  @IsNumber()
  @Type(() => Number)
  rateUsdBrl: number;

  @ApiProperty({
    example: 'https://api.bacen.gov.br/v1/rates',
    description: 'Oracle API endpoint',
    required: false,
  })
  @IsOptional()
  @IsString()
  apiEndpoint?: string;
}
