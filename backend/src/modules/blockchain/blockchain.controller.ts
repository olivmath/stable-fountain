import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { CreateBlockchainDto } from './dto/create-blockchain.dto';
import { UpdateBlockchainDto } from './dto/update-blockchain.dto';

@ApiTags('Blockchain')
@ApiBearerAuth('access-token')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  @ApiOperation({ summary: 'Configure blockchain connection' })
  @ApiResponse({
    status: 201,
    description: 'Blockchain configuration created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid blockchain configuration',
  })
  create(@Body() createBlockchainDto: CreateBlockchainDto) {
    return this.blockchainService.create(createBlockchainDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blockchain configurations' })
  @ApiResponse({
    status: 200,
    description: 'Blockchain configurations retrieved',
  })
  findAll() {
    return this.blockchainService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blockchain configuration by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blockchain configuration retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Configuration not found',
  })
  findOne(@Param('id') id: string) {
    return this.blockchainService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blockchain configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration updated',
  })
  update(@Param('id') id: string, @Body() updateBlockchainDto: UpdateBlockchainDto) {
    return this.blockchainService.update(+id, updateBlockchainDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blockchain configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration deleted',
  })
  remove(@Param('id') id: string) {
    return this.blockchainService.remove(+id);
  }
}
