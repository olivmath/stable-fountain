import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { XRPLClientService } from './services/xrpl-client.service';
import { WalletManagerService } from './services/wallet-manager.service';
import { IssuedCurrencyService } from './services/issued-currency.service';

/**
 * BlockchainModule
 *
 * Centralizes all XRPL blockchain services and controllers
 * Provides a unified interface for interacting with the XRP Ledger
 *
 * Services:
 * - XRPLClientService: WebSocket connection management and transaction submission
 * - WalletManagerService: Wallet generation, encryption, and balance queries
 * - IssuedCurrencyService: Mint, burn, clawback, and trustline operations
 *
 * Note: Services are exported to make them available to other modules
 */
@Module({
  imports: [ConfigModule],
  controllers: [BlockchainController],
  providers: [
    BlockchainService,
    XRPLClientService,
    WalletManagerService,
    IssuedCurrencyService,
  ],
  exports: [
    XRPLClientService,
    WalletManagerService,
    IssuedCurrencyService,
  ],
})
export class BlockchainModule {}
