import { Injectable, Logger } from '@nestjs/common';
import { Wallet, Client } from 'xrpl';
import * as crypto from 'crypto';
import { XRPLClientService } from './xrpl-client.service';

/**
 * WalletManagerService
 *
 * Gerencia criação, armazenamento seguro e uso de wallets XRPL
 * Responsável por: gerar wallets, criptografar/descriptografar seeds,
 * financiar wallets de teste, obter saldos
 */
@Injectable()
export class WalletManagerService {
  private readonly logger = new Logger(WalletManagerService.name);
  private readonly encryptionAlgorithm = 'aes-256-cbc';
  private encryptionKey: Buffer;

  constructor(private xrplClient: XRPLClientService) {
    // Usar uma chave derivada de hash SHA-256 de uma chave-mestre
    // Em produção, usar Vault para armazenar a chave-mestre
    const masterKey = process.env.WALLET_ENCRYPTION_KEY || 'default-dev-key-change-in-prod';
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(masterKey)
      .digest();
  }

  /**
   * Gera uma nova wallet XRPL aleatória
   * Retorna address e seed (descriptografados)
   */
  generateWallet(): { address: string; seed: string } {
    try {
      const wallet = Wallet.generate();

      this.logger.log(
        `✅ Generated new wallet: ${wallet.address}`
      );

      return {
        address: wallet.address,
        seed: wallet.seed,
      };
    } catch (error) {
      this.logger.error(`Error generating wallet: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Criptografa um seed de wallet usando AES-256-CBC
   * Retorna string criptografada em base64
   */
  encryptSeed(seed: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.encryptionAlgorithm,
        this.encryptionKey,
        iv
      );

      let encrypted = cipher.update(seed, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Retornar IV + encrypted como base64 para armazenar no banco
      const combined = iv.toString('hex') + ':' + encrypted;
      return Buffer.from(combined).toString('base64');
    } catch (error) {
      this.logger.error(`Error encrypting seed: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Descriptografa um seed que foi criptografado com encryptSeed()
   */
  decryptSeed(encryptedSeed: string): string {
    try {
      const combined = Buffer.from(encryptedSeed, 'base64').toString('hex');
      const [ivHex, encrypted] = combined.split(':');
      const iv = Buffer.from(ivHex, 'hex');

      const decipher = crypto.createDecipheriv(
        this.encryptionAlgorithm,
        this.encryptionKey,
        iv
      );

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error(`Error decrypting seed: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Obtém instância de Wallet a partir de um seed
   */
  getWalletFromSeed(seed: string): Wallet {
    try {
      return Wallet.fromSeed(seed);
    } catch (error) {
      this.logger.error(`Error creating wallet from seed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Financia uma wallet no testnet usando faucet
   * Apenas funciona na testnet
   */
  async fundWalletFromFaucet(address: string): Promise<{
    success: boolean;
    amount: string;
    transactionId?: string;
  }> {
    try {
      this.logger.log(`Funding wallet ${address} from testnet faucet...`);

      // Usar faucet da Ripple
      const response = await fetch('https://faucet.altnet.rippletest.net/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: address }),
      });

      if (!response.ok) {
        throw new Error(`Faucet error: ${response.statusText}`);
      }

      const data = await response.json() as any;

      this.logger.log(
        `✅ Wallet ${address} funded. Balance: ${data.account?.Balance || 'unknown'}`
      );

      return {
        success: true,
        amount: data.account?.Balance || '1000000000', // 1000 XRP em drops
        transactionId: data.txid,
      };
    } catch (error) {
      this.logger.error(
        `Error funding wallet from faucet: ${error.message}`,
        error
      );
      return {
        success: false,
        amount: '0',
      };
    }
  }

  /**
   * Obtém o saldo XRP de uma wallet
   */
  async getXRPBalance(address: string): Promise<{
    xrp: string;
    drops: string;
  }> {
    try {
      const accountInfo = await this.xrplClient.getAccountInfo(address);

      const drops = accountInfo.Account.Balance;
      const xrp = (Number(drops) / 1000000).toString();

      return { xrp, drops };
    } catch (error) {
      this.logger.error(
        `Error getting XRP balance for ${address}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Obtém todos os saldos de uma wallet (XRP + Issued Currencies)
   */
  async getFullBalances(address: string): Promise<{
    xrp: string;
    issuedCurrencies: Array<{
      currency: string;
      value: string;
      issuer: string;
      limit: string;
    }>;
  }> {
    try {
      const xrpData = await this.getXRPBalance(address);
      const accountLines = await this.xrplClient.getAccountLines(address);

      const issuedCurrencies = accountLines.lines.map((line: any) => ({
        currency: line.currency,
        value: line.balance,
        issuer: line.account,
        limit: line.limit,
      }));

      return {
        xrp: xrpData.xrp,
        issuedCurrencies,
      };
    } catch (error) {
      this.logger.error(
        `Error getting full balances for ${address}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Valida se um seed é válido
   */
  isValidSeed(seed: string): boolean {
    try {
      Wallet.fromSeed(seed);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Valida se um endereço é válido
   */
  isValidAddress(address: string): boolean {
    return this.xrplClient.isValidAddress(address);
  }

  /**
   * Obtém informações públicas de uma wallet (sem expor a chave privada)
   */
  async getWalletPublicInfo(address: string): Promise<{
    address: string;
    xrp: string;
    currencyCount: number;
    issuedCurrencies: Array<{
      currency: string;
      value: string;
    }>;
  }> {
    try {
      const balances = await this.getFullBalances(address);

      return {
        address,
        xrp: balances.xrp,
        currencyCount: balances.issuedCurrencies.length,
        issuedCurrencies: balances.issuedCurrencies.map((ic) => ({
          currency: ic.currency,
          value: ic.value,
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error getting wallet public info for ${address}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Gera uma nova wallet, a criptografa e a retorna pronta para armazenar
   * Retorna: { address, encryptedSeed }
   */
  generateAndEncryptWallet(): {
    address: string;
    encryptedSeed: string;
    seed: string; // Apenas para retornar ao criador, não armazenar
  } {
    const wallet = this.generateWallet();
    const encryptedSeed = this.encryptSeed(wallet.seed);

    this.logger.log(`Generated new encrypted wallet: ${wallet.address}`);

    return {
      address: wallet.address,
      encryptedSeed,
      seed: wallet.seed, // Apenas para display inicial
    };
  }

  /**
   * Reconstrói a wallet a partir de um seed criptografado armazenado
   * Este é o método principal para "carregar" uma wallet do banco
   */
  loadWalletFromEncrypted(encryptedSeed: string): Wallet {
    const decryptedSeed = this.decryptSeed(encryptedSeed);
    return this.getWalletFromSeed(decryptedSeed);
  }
}
