import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenizersService } from './tokenizers.service';
import { CreateTokenizerDto } from './dto/create-tokenizer.dto';
import { UpdateTokenizerDto } from './dto/update-tokenizer.dto';
import { Tokenizer } from './entities/tokenizer.entity';
import { WalletManagerService } from '../blockchain/services/wallet-manager.service';

@ApiTags('Tokenizers')
@Controller('tokenizers')
export class TokenizersController {
  constructor(
    private readonly tokenizersService: TokenizersService,
    private readonly walletManager: WalletManagerService,
  ) {}

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

  @Post(':id/wallet')
  @ApiOperation({
    summary: 'Generate and assign XRPL wallet to tokenizer',
    description: 'Creates a new XRPL wallet, encrypts the seed, and assigns it to the tokenizer',
  })
  @ApiResponse({
    status: 201,
    description: 'Wallet generated and assigned',
    schema: {
      example: {
        id: 'uuid',
        address: 'rN7n7otQDd6FczFgLdlqtyMVrPbDcaLYwc',
        encryptedSeed: 'base64-encoded-encrypted-seed',
        xrplNetwork: 'testnet',
        walletCreatedAt: '2024-11-10T01:18:00.000Z',
      },
    },
  })
  async generateWallet(@Param('id') tokenizerId: string) {
    return this.tokenizersService.generateAndAssignWallet(tokenizerId);
  }
}
