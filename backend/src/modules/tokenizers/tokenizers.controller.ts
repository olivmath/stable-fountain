import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenizersService } from './tokenizers.service';
import { CreateTokenizerDto } from './dto/create-tokenizer.dto';
import { UpdateTokenizerDto } from './dto/update-tokenizer.dto';
import { Tokenizer } from './entities/tokenizer.entity';

@ApiTags('Tokenizers')
@Controller('tokenizers')
export class TokenizersController {
  constructor(private readonly tokenizersService: TokenizersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tokenizer' })
  @ApiResponse({ status: 201, description: 'Tokenizer created', type: Tokenizer })
  create(@Body() createTokenizerDto: CreateTokenizerDto) {
    return this.tokenizersService.create(createTokenizerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tokenizers' })
  @ApiResponse({ status: 200, description: 'List of tokenizers', type: [Tokenizer] })
  findAll() {
    return this.tokenizersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tokenizer by ID' })
  @ApiResponse({ status: 200, description: 'Tokenizer found', type: Tokenizer })
  findOne(@Param('id') id: string) {
    return this.tokenizersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tokenizer' })
  @ApiResponse({ status: 200, description: 'Tokenizer updated', type: Tokenizer })
  update(@Param('id') id: string, @Body() updateTokenizerDto: UpdateTokenizerDto) {
    return this.tokenizersService.update(id, updateTokenizerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tokenizer' })
  @ApiResponse({ status: 200, description: 'Tokenizer deleted' })
  remove(@Param('id') id: string) {
    return this.tokenizersService.remove(id);
  }
}
