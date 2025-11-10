import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Wallet } from 'xrpl';
import { XRPLClientService } from './xrpl-client.service';
import { WalletManagerService } from './wallet-manager.service';

/**
 * IssuedCurrencyService
 *
 * Gerencia operações de Issued Currencies (stablecoins) na XRPL
 * Responsável por: mint, burn, trustlines, clawback
 */
@Injectable()
export class IssuedCurrencyService {
  private readonly logger = new Logger(IssuedCurrencyService.name);

  constructor(
    private xrplClient: XRPLClientService,
    private walletManager: WalletManagerService
  ) {}

  /**
   * Cria uma trustline entre issuer e holder para uma Issued Currency
   * Necessário antes de poder emitir tokens
   */
  async createTrustLine(
    issuerSeed: string,
    holderAddress: string,
    currencyCode: string,
    limit: string = '1000000'
  ): Promise<{ hash: string; ledgerIndex: number }> {
    if (!this.xrplClient.isReady()) {
      throw new Error('XRPL client not connected');
    }

    if (!this.walletManager.isValidAddress(holderAddress)) {
      throw new BadRequestException('Invalid holder address');
    }

    if (currencyCode.length < 3 || currencyCode.length > 40) {
      throw new BadRequestException(
        'Currency code must be 3-40 characters'
      );
    }

    try {
      const issuerWallet = this.walletManager.getWalletFromSeed(issuerSeed);

      this.logger.log(
        `Creating trustline: issuer=${issuerWallet.address}, holder=${holderAddress}, currency=${currencyCode}, limit=${limit}`
      );

      // Transação TrustSet que estabelece a trustline
      // IMPORTANTE: Deve ser executada pelo ISSUER para definir permissões
      const trustSetTx = {
        TransactionType: 'TrustSet',
        Account: issuerWallet.address,
        LimitAmount: {
          currency: currencyCode,
          issuer: issuerWallet.address,
          value: limit,
        },
        Flags: 131072, // tfSetNoRipple - para mais controle
      };

      const result = await this.xrplClient.submitTransaction(
        trustSetTx,
        issuerWallet
      );

      this.logger.log(
        `✅ Trustline created successfully. Hash: ${result.hash}`
      );

      return {
        hash: result.hash,
        ledgerIndex: result.ledgerIndex,
      };
    } catch (error) {
      this.logger.error(`Error creating trustline: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Emite tokens (stablecoin) para um holder
   * Usa Payment transaction com Issued Currency
   */
  async mintToken(
    issuerSeed: string,
    holderAddress: string,
    currencyCode: string,
    amount: string // Amount em unidades da moeda (ex: "1000.50")
  ): Promise<{ hash: string; ledgerIndex: number; amount: string }> {
    if (!this.xrplClient.isReady()) {
      throw new Error('XRPL client not connected');
    }

    if (!this.walletManager.isValidAddress(holderAddress)) {
      throw new BadRequestException('Invalid holder address');
    }

    if (parseFloat(amount) <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    try {
      const issuerWallet = this.walletManager.getWalletFromSeed(issuerSeed);

      this.logger.log(
        `Minting token: issuer=${issuerWallet.address}, holder=${holderAddress}, currency=${currencyCode}, amount=${amount}`
      );

      // Payment transaction de moeda customizada
      const mintTx = {
        TransactionType: 'Payment',
        Account: issuerWallet.address, // Issuer envia
        Destination: holderAddress, // Para o holder
        Amount: {
          currency: currencyCode,
          value: amount,
          issuer: issuerWallet.address, // Quem emite essa moeda
        },
      };

      const result = await this.xrplClient.submitTransaction(
        mintTx,
        issuerWallet
      );

      this.logger.log(
        `✅ Token minted successfully. Hash: ${result.hash}, Amount: ${amount} ${currencyCode}`
      );

      return {
        hash: result.hash,
        ledgerIndex: result.ledgerIndex,
        amount,
      };
    } catch (error) {
      this.logger.error(`Error minting token: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Queima tokens (reduz supply) quando holder envia de volta para issuer
   * Usa Payment transaction (holder paga issuer)
   */
  async burnToken(
    holderSeed: string,
    issuerAddress: string,
    currencyCode: string,
    amount: string
  ): Promise<{ hash: string; ledgerIndex: number; amount: string }> {
    if (!this.xrplClient.isReady()) {
      throw new Error('XRPL client not connected');
    }

    if (!this.walletManager.isValidAddress(issuerAddress)) {
      throw new BadRequestException('Invalid issuer address');
    }

    if (parseFloat(amount) <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    try {
      const holderWallet = this.walletManager.getWalletFromSeed(holderSeed);

      this.logger.log(
        `Burning token: holder=${holderWallet.address}, issuer=${issuerAddress}, currency=${currencyCode}, amount=${amount}`
      );

      // Payment transaction: holder envia tokens de volta para issuer
      // Isso efetivamente queima os tokens (reduz supply)
      const burnTx = {
        TransactionType: 'Payment',
        Account: holderWallet.address, // Holder envia
        Destination: issuerAddress, // De volta para o issuer
        Amount: {
          currency: currencyCode,
          value: amount,
          issuer: issuerAddress, // Moeda do issuer
        },
      };

      const result = await this.xrplClient.submitTransaction(
        burnTx,
        holderWallet
      );

      this.logger.log(
        `✅ Token burned successfully. Hash: ${result.hash}, Amount: ${amount} ${currencyCode}`
      );

      return {
        hash: result.hash,
        ledgerIndex: result.ledgerIndex,
        amount,
      };
    } catch (error) {
      this.logger.error(`Error burning token: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Executa Clawback para recuperar tokens (compliance/resgate)
   * Apenas issuer pode fazer clawback
   */
  async clawbackToken(
    issuerSeed: string,
    holderAddress: string,
    currencyCode: string,
    amount: string
  ): Promise<{ hash: string; ledgerIndex: number; amount: string }> {
    if (!this.xrplClient.isReady()) {
      throw new Error('XRPL client not connected');
    }

    if (!this.walletManager.isValidAddress(holderAddress)) {
      throw new BadRequestException('Invalid holder address');
    }

    if (parseFloat(amount) <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    try {
      const issuerWallet = this.walletManager.getWalletFromSeed(issuerSeed);

      this.logger.log(
        `Clawing back token: issuer=${issuerWallet.address}, holder=${holderAddress}, currency=${currencyCode}, amount=${amount}`
      );

      // Clawback transaction
      const clawbackTx = {
        TransactionType: 'Clawback',
        Account: issuerWallet.address, // Issuer executa clawback
        Amount: {
          currency: currencyCode,
          value: amount,
          issuer: issuerWallet.address,
        },
        Holder: holderAddress, // Holder que vai ter tokens recuperados
      };

      const result = await this.xrplClient.submitTransaction(
        clawbackTx,
        issuerWallet
      );

      this.logger.log(
        `✅ Token clawed back successfully. Hash: ${result.hash}, Amount: ${amount} ${currencyCode}`
      );

      return {
        hash: result.hash,
        ledgerIndex: result.ledgerIndex,
        amount,
      };
    } catch (error) {
      this.logger.error(`Error clawing back token: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Configura permissões de clawback na wallet issuer
   * Deve ser feito uma vez no setup da wallet
   */
  async enableClawback(issuerSeed: string): Promise<{
    hash: string;
    ledgerIndex: number;
  }> {
    if (!this.xrplClient.isReady()) {
      throw new Error('XRPL client not connected');
    }

    try {
      const issuerWallet = this.walletManager.getWalletFromSeed(issuerSeed);

      this.logger.log(`Enabling clawback for issuer ${issuerWallet.address}`);

      // AccountSet para habilitar clawback
      // Flag 8: lsfAllowClawback
      const enableClawbackTx = {
        TransactionType: 'AccountSet',
        Account: issuerWallet.address,
        SetFlag: 8, // lsfAllowClawback
      };

      const result = await this.xrplClient.submitTransaction(
        enableClawbackTx,
        issuerWallet
      );

      this.logger.log(
        `✅ Clawback enabled successfully. Hash: ${result.hash}`
      );

      return {
        hash: result.hash,
        ledgerIndex: result.ledgerIndex,
      };
    } catch (error) {
      this.logger.error(`Error enabling clawback: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Obtém saldo de um issued currency para um holder
   */
  async getBalance(
    holderAddress: string,
    issuerAddress: string,
    currencyCode: string
  ): Promise<{ balance: string; limit: string; quality: string }> {
    try {
      const accountLines = await this.xrplClient.getAccountLines(
        holderAddress,
        issuerAddress
      );

      const currencyLine = accountLines.lines.find(
        (line: any) => line.currency === currencyCode
      );

      if (!currencyLine) {
        return {
          balance: '0',
          limit: '0',
          quality: '0',
        };
      }

      return {
        balance: currencyLine.balance,
        limit: currencyLine.limit,
        quality: currencyLine.quality_in || '1',
      };
    } catch (error) {
      this.logger.error(
        `Error getting balance: ${error.message}`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtém todos os issued currencies emitidos por um issuer
   */
  async getIssuedCurrencies(issuerAddress: string): Promise<
    Array<{
      currency: string;
      holders: number;
      totalSupply: string;
    }>
  > {
    try {
      // NOTA: XRPL não tem endpoint direto para listar issued currencies
      // Precisamos querying account_lines de potenciais holders ou usar
      // o ledger state de forma mais complexa
      // Por enquanto, retornar vazio e buscar via blockchain subscribers

      this.logger.log(
        `Note: Getting issued currencies requires advanced ledger queries for ${issuerAddress}`
      );

      return [];
    } catch (error) {
      this.logger.error(
        `Error getting issued currencies: ${error.message}`,
        error
      );
      throw error;
    }
  }

  /**
   * Valida se uma trustline existe entre issuer e holder
   */
  async trustLineExists(
    holderAddress: string,
    issuerAddress: string,
    currencyCode: string
  ): Promise<boolean> {
    try {
      const balance = await this.getBalance(
        holderAddress,
        issuerAddress,
        currencyCode
      );

      return balance.limit !== '0';
    } catch {
      return false;
    }
  }
}
