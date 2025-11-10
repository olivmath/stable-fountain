import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenizerDto } from './dto/create-tokenizer.dto';
import { UpdateTokenizerDto } from './dto/update-tokenizer.dto';
import { Tokenizer } from './entities/tokenizer.entity';
import { WalletManagerService } from '../blockchain/services/wallet-manager.service';
import * as crypto from 'crypto';

@Injectable()
export class TokenizersService {
  private readonly logger = new Logger(TokenizersService.name);

  constructor(
    @InjectRepository(Tokenizer)
    private tokenizerRepository: Repository<Tokenizer>,
    private walletManager: WalletManagerService,
  ) {}

  async create(createTokenizerDto: CreateTokenizerDto) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const tokenizer = this.tokenizerRepository.create({
      ...createTokenizerDto,
      apiKeyHash,
    });
    await this.tokenizerRepository.save(tokenizer);

    return { ...tokenizer, apiKey };
  }

  async findAll() {
    return this.tokenizerRepository.find();
  }

  async findOne(id: string) {
    return this.tokenizerRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTokenizerDto: UpdateTokenizerDto) {
    await this.tokenizerRepository.update(id, updateTokenizerDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.tokenizerRepository.delete(id);
    return { success: true };
  }

  /**
   * Generates a new XRPL wallet and assigns it to a tokenizer
   *
   * Process:
   * 1. Generates random wallet using XRPL library
   * 2. Encrypts the seed using AES-256-CBC
   * 3. Stores encrypted seed and wallet address in database
   * 4. Returns wallet address and encrypted seed to client
   *
   * Note: The seed is returned to client ONCE. Client must safely store it.
   * Server only stores the encrypted version.
   */
  async generateAndAssignWallet(tokenizerId: string) {
    // Find tokenizer
    const tokenizer = await this.tokenizerRepository.findOne({
      where: { id: tokenizerId },
    });

    if (!tokenizer) {
      throw new NotFoundException(`Tokenizer with ID ${tokenizerId} not found`);
    }

    try {
      this.logger.log(`Generating wallet for tokenizer ${tokenizerId}...`);

      // Generate wallet using WalletManagerService
      const wallet = this.walletManager.generateAndEncryptWallet();

      // Update tokenizer with wallet information
      await this.tokenizerRepository.update(tokenizerId, {
        issuerWalletAddress: wallet.address,
        encryptedSeed: wallet.encryptedSeed,
        walletCreatedAt: new Date(),
      });

      this.logger.log(
        `✅ Wallet generated and assigned to tokenizer ${tokenizerId}. Address: ${wallet.address}`,
      );

      // Return wallet info (including unencrypted seed for one-time display)
      return {
        id: tokenizerId,
        address: wallet.address,
        seed: wallet.seed, // IMPORTANT: Only returned here, never stored unencrypted
        encryptedSeed: wallet.encryptedSeed,
        xrplNetwork: tokenizer.xrplNetwork,
        walletCreatedAt: new Date(),
        warning: 'Save the seed securely. It will not be shown again.',
      };
    } catch (error) {
      this.logger.error(
        `Error generating wallet for tokenizer ${tokenizerId}: ${error.message}`,
        error,
      );
      throw error;
    }
  }
}
