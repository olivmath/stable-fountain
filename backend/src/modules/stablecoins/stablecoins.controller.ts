import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StablecoinsService } from './stablecoins.service';
import { CreateStablecoinDto } from './dto/create-stablecoin.dto';
import { UpdateStablecoinDto } from './dto/update-stablecoin.dto';
import { BurnStablecoinDto } from './dto/burn-stablecoin.dto';
import { Stablecoin } from './entities/stablecoin.entity';

@ApiTags('Stablecoins')
@Controller('stablecoins')
export class StablecoinsController {
  constructor(private readonly stablecoinsService: StablecoinsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stablecoin' })
  @ApiResponse({ status: 201, description: 'Stablecoin created', type: Stablecoin })
  create(@Body() createStablecoinDto: CreateStablecoinDto) {
    return this.stablecoinsService.create(createStablecoinDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stablecoins' })
  @ApiResponse({ status: 200, description: 'List of stablecoins', type: [Stablecoin] })
  findAll() {
    return this.stablecoinsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stablecoin by ID' })
  @ApiResponse({ status: 200, description: 'Stablecoin found', type: Stablecoin })
  findOne(@Param('id') id: string) {
    return this.stablecoinsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update stablecoin' })
  @ApiResponse({ status: 200, description: 'Stablecoin updated', type: Stablecoin })
  update(@Param('id') id: string, @Body() updateStablecoinDto: UpdateStablecoinDto) {
    return this.stablecoinsService.update(id, updateStablecoinDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stablecoin' })
  @ApiResponse({ status: 200, description: 'Stablecoin deleted' })
  remove(@Param('id') id: string) {
    return this.stablecoinsService.remove(id);
  }

  @Post(':id/burn')
  @ApiOperation({
    summary: 'Burn stablecoin tokens and return funds',
    description: 'Burn stablecoin tokens and return funds via RLUSD (on-chain) or PIX (off-chain)',
  })
  @ApiResponse({
    status: 201,
    description: 'Burn operation initiated',
    schema: {
      example: {
        operationId: 'burn-660e8400-e29b-41d4-a716-446655440001-1731234567890',
        status: 'pending',
        stablecoinId: '660e8400-e29b-41d4-a716-446655440001',
        currencyCode: 'APBRL',
        amountBrl: 500,
        returnAsset: 'RLUSD',
        returnDestination: 'rClientOnChainWallet...',
      },
    },
  })
  async burn(@Param('id') stablecoinId: string, @Body() burnDto: BurnStablecoinDto) {
    return this.stablecoinsService.burn(stablecoinId, burnDto);
  }
}
