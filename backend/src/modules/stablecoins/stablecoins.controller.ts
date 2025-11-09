import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StablecoinsService } from './stablecoins.service';
import { CreateStablecoinDto } from './dto/create-stablecoin.dto';
import { UpdateStablecoinDto } from './dto/update-stablecoin.dto';
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
}
