import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Wallet } from 'xrpl';

/**
 * XRPLClientService
 *
 * Gerencia conexão com XRPL Testnet/Mainnet
 * Responsável por: conectar, desconectar, enviar transações, query de dados
 */
@Injectable()
export class XRPLClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(XRPLClientService.name);
  private client: Client;
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000; // ms

  constructor(private configService: ConfigService) {}

  /**
   * Inicializa conexão com XRPL ao carregar o módulo
   */
  async onModuleInit() {
    try {
      await this.connect();
    } catch (error) {
      this.logger.error('Failed to connect to XRPL on module init', error);
      // Não falhar o startup, tentar reconectar mais tarde
    }
  }

  /**
   * Desconecta da XRPL ao derrubar o módulo
   */
  async onModuleDestroy() {
    await this.disconnect();
  }

  /**
   * Conecta ao XRPL
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.log('Already connected to XRPL');
      return;
    }

    const wsUrl = this.configService.get<string>('XRPL_WEBSOCKET_URL');
    const network = this.configService.get<string>('XRPL_NETWORK', 'testnet');

    this.logger.log(`Connecting to XRPL (${network}) at ${wsUrl}`);

    try {
      this.client = new Client(wsUrl);
      await this.client.connect();
      this.isConnected = true;
      this.reconnectAttempts = 0;

      this.logger.log('✅ Successfully connected to XRPL');
      this.setupEventHandlers();
    } catch (error) {
      this.logger.error(`Failed to connect to XRPL: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Desconecta da XRPL
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.disconnect();
      this.isConnected = false;
      this.logger.log('Disconnected from XRPL');
    } catch (error) {
      this.logger.error(`Error disconnecting from XRPL: ${error.message}`, error);
    }
  }

  /**
   * Tenta reconectar automaticamente em caso de desconexão
   */
  private setupEventHandlers() {
    if (!this.client) return;

    this.client.on('error', (error) => {
      this.logger.error(`XRPL client error: ${error.message}`, error);
      this.isConnected = false;
      this.attemptReconnect();
    });

    this.client.on('disconnect', () => {
      this.logger.warn('XRPL client disconnected');
      this.isConnected = false;
      this.attemptReconnect();
    });
  }

  /**
   * Tenta reconectar com backoff exponencial
   */
  private async attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error(
        `Max reconnection attempts (${this.maxReconnectAttempts}) reached. Stopping.`
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    this.logger.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        this.logger.error(`Reconnection attempt failed: ${error.message}`);
      });
    }, delay);
  }

  /**
   * Verifica se está conectado
   */
  isReady(): boolean {
    return this.isConnected && this.client !== undefined;
  }

  /**
   * Retorna instância do client para uso direto (quando necessário)
   */
  getClient(): Client {
    if (!this.isReady()) {
      throw new Error('XRPL client is not connected');
    }
    return this.client;
  }

  /**
   * Submete uma transação para a rede XRPL
   */
  async submitTransaction(
    transaction: any,
    wallet: Wallet
  ): Promise<{ hash: string; ledgerIndex: number; status: string }> {
    if (!this.isReady()) {
      throw new Error('XRPL client is not connected');
    }

    try {
      this.logger.debug(
        `Submitting transaction: ${JSON.stringify(transaction, null, 2)}`
      );

      const response = await this.client.submitAndWait(transaction, {
        wallet,
        autofill: true,
      });

      const hash = response.result.hash;
      const ledgerIndex = response.result.ledger_index;

      this.logger.log(
        `✅ Transaction submitted successfully. Hash: ${hash}, Ledger: ${ledgerIndex}`
      );

      return {
        hash,
        ledgerIndex,
        status: response.result.meta.TransactionResult,
      };
    } catch (error) {
      this.logger.error(
        `Error submitting transaction: ${error.message}`,
        error
      );
      throw error;
    }
  }

  /**
   * Faz uma query genérica na XRPL
   */
  async request(command: string, data: any): Promise<any> {
    if (!this.isReady()) {
      throw new Error('XRPL client is not connected');
    }

    try {
      const response = await this.client.request({
        command,
        ...data,
      });

      return response.result;
    } catch (error) {
      this.logger.error(
        `Error executing XRPL command '${command}': ${error.message}`,
        error
      );
      throw error;
    }
  }

  /**
   * Busca informações da conta
   */
  async getAccountInfo(address: string) {
    return this.request('account_info', { account: address });
  }

  /**
   * Busca trust lines da conta (issued currencies)
   */
  async getAccountLines(
    address: string,
    peer?: string,
    ledgerIndex?: string
  ) {
    const params: any = { account: address };
    if (peer) params.peer = peer;
    if (ledgerIndex) params.ledger_index = ledgerIndex;

    return this.request('account_lines', params);
  }

  /**
   * Busca ofertas de uma conta
   */
  async getAccountOffers(address: string) {
    return this.request('account_offers', { account: address });
  }

  /**
   * Busca histórico de transações
   */
  async getAccountTransactions(address: string, ledgerIndexMin?: number) {
    const params: any = { account: address };
    if (ledgerIndexMin !== undefined) {
      params.ledger_index_min = ledgerIndexMin;
    }

    return this.request('account_tx', params);
  }

  /**
   * Busca detalhes de uma transação
   */
  async getTransaction(hash: string) {
    return this.request('tx', { transaction: hash });
  }

  /**
   * Valida um endereço XRPL
   */
  isValidAddress(address: string): boolean {
    try {
      return Wallet.isClassicAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Retorna a taxa de transação recomendada (em drops)
   */
  async getRecommendedFee(): Promise<string> {
    try {
      const serverInfo = await this.request('server_info', {});
      return serverInfo.validated_ledger_index
        ? serverInfo.loads?.cluster_base_fee_drops ||
            serverInfo.loads?.base_fee_drops ||
            '12'
        : '12';
    } catch {
      // Default fee de 12 drops (0.000012 XRP) se falhar
      return '12';
    }
  }

  /**
   * Healthcheck para verificar status de conexão
   */
  async healthCheck(): Promise<{
    connected: boolean;
    network: string;
    ledgerIndex: number;
    validatedLedgers: string;
  }> {
    if (!this.isReady()) {
      return {
        connected: false,
        network: this.configService.get<string>('XRPL_NETWORK', 'testnet'),
        ledgerIndex: 0,
        validatedLedgers: '',
      };
    }

    try {
      const serverInfo = await this.request('server_info', {});

      return {
        connected: true,
        network: this.configService.get<string>('XRPL_NETWORK', 'testnet'),
        ledgerIndex: serverInfo.validated_ledger_index || 0,
        validatedLedgers: serverInfo.validated_ledgers || '',
      };
    } catch (error) {
      this.logger.error(`Healthcheck failed: ${error.message}`);
      return {
        connected: false,
        network: this.configService.get<string>('XRPL_NETWORK', 'testnet'),
        ledgerIndex: 0,
        validatedLedgers: '',
      };
    }
  }
}
