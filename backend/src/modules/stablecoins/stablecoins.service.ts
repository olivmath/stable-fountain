import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStablecoinDto } from './dto/create-stablecoin.dto';
import { UpdateStablecoinDto } from './dto/update-stablecoin.dto';
import { BurnStablecoinDto } from './dto/burn-stablecoin.dto';
import { Stablecoin } from './entities/stablecoin.entity';
import { CustomLogger } from '../../common/logger.service';

@Injectable()
export class StablecoinsService {
  constructor(
    @InjectRepository(Stablecoin)
    private stablecoinRepository: Repository<Stablecoin>,
    private logger: CustomLogger,
  ) {}

  async create(createStablecoinDto: CreateStablecoinDto) {
    const stablecoin = this.stablecoinRepository.create(createStablecoinDto);
    return this.stablecoinRepository.save(stablecoin);
  }

  async findAll() {
    return this.stablecoinRepository.find();
  }

  async findOne(id: string) {
    return this.stablecoinRepository.findOne({ where: { id } });
  }

  async update(id: string, updateStablecoinDto: UpdateStablecoinDto) {
    await this.stablecoinRepository.update(id, updateStablecoinDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.stablecoinRepository.delete(id);
    return { success: true };
  }

  /**
   * Burn stablecoin tokens and return funds via RLUSD or PIX
   *
   * Process:
   * 1. Validate stablecoin exists and token amount is available
   * 2. Calculate return amount (BRL → XRP or BRL → PIX via exchange rate)
   * 3. Execute clawback on XRPL to burn tokens
   * 4. Return funds via specified method (RLUSD or PIX)
   * 5. Update operation status
   * 6. Send webhook notification
   */
  async burn(stablecoinId: string, burnDto: BurnStablecoinDto) {
    try {
      this.logger.logOperationStart('BURN', {
        stablecoinId,
        amountBrl: burnDto.amountBrl,
        returnAsset: burnDto.returnAsset,
      });

      // Step 1: Validate stablecoin exists
      this.logger.logStep(1, 'Validating stablecoin exists');
      const stablecoin = await this.stablecoinRepository.findOne({
        where: { id: stablecoinId },
      });

      if (!stablecoin) {
        this.logger.logWarning('Burn failed - Stablecoin not found', { stablecoinId });
        throw new NotFoundException(`Stablecoin with ID ${stablecoinId} not found`);
      }

      this.logger.logValidation('Stablecoin found', true, {
        currencyCode: stablecoin.stableCode,
        issuer: stablecoin.issuerWalletAddress,
      });

      // Step 2: Validate sufficient balance
      this.logger.logStep(2, 'Validating sufficient BRL balance');
      if (stablecoin.totalDepositedBrl < burnDto.amountBrl) {
        this.logger.logWarning('Burn failed - Insufficient balance', {
          available: stablecoin.totalDepositedBrl,
          requested: burnDto.amountBrl,
        });
        throw new BadRequestException(
          `Insufficient balance. Available: ${stablecoin.totalDepositedBrl}, Requested: ${burnDto.amountBrl}`,
        );
      }

      this.logger.logValidation('Balance sufficient', true, {
        available: stablecoin.totalDepositedBrl,
        requested: burnDto.amountBrl,
      });

      // Step 3: Calculate return amount based on asset type
      this.logger.logStep(3, 'Calculating return amount based on asset type');
      let returnCalculation: any;

      if (burnDto.returnAsset === 'RLUSD') {
        // For RLUSD returns, use USD/BRL rate
        returnCalculation = {
          method: 'BRL → USD → RLUSD',
          note: 'Assumes 1 RLUSD = 1 USD',
        };
      } else {
        // For PIX returns, use direct BRL calculation
        returnCalculation = {
          method: 'BRL direct return via PIX',
          note: 'Binance will handle BRL/XRP if needed',
        };
      }

      this.logger.logCalculation('Return amount calculation',
        { amountBrl: burnDto.amountBrl, returnAsset: burnDto.returnAsset },
        returnCalculation
      );

      // Step 4: Log operation completion (actual blockchain interaction would happen in operations service)
      this.logger.logStep(4, 'Preparing burn operation', {
        stablecoinId,
        currencyCode: stablecoin.stableCode,
        amountBrl: burnDto.amountBrl,
        destination: burnDto.returnAsset === 'RLUSD' ? burnDto.clientWallet : burnDto.clientCpf,
      });

      // Step 5: Prepare response
      const response = {
        operationId: `burn-${stablecoinId}-${Date.now()}`,
        status: 'pending',
        stablecoinId,
        currencyCode: stablecoin.stableCode,
        amountBrl: burnDto.amountBrl,
        returnAsset: burnDto.returnAsset,
        returnDestination: burnDto.returnAsset === 'RLUSD' ? burnDto.clientWallet : burnDto.clientCpf,
      };

      this.logger.logOperationSuccess('BURN', response);
      return response;

    } catch (error) {
      this.logger.logOperationError('BURN', error);
      throw error;
    }
  }
}
