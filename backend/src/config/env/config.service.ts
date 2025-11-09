import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  // ===== Server Configuration =====
  get nodeEnv(): string {
    return this.configService.getOrThrow<string>('NODE_ENV');
  }

  get port(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // ===== Database Configuration =====
  get dbHost(): string {
    return this.configService.getOrThrow<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.getOrThrow<number>('DB_PORT');
  }

  get dbUsername(): string {
    return this.configService.getOrThrow<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.configService.getOrThrow<string>('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.getOrThrow<string>('DB_NAME');
  }

  /**
   * Builds PostgreSQL connection string
   * Supports both standard postgres://user:pass@host:port/db and Supabase format
   */
  get databaseUrl(): string {
    const host = this.dbHost;
    const port = this.dbPort;
    const username = this.dbUsername;
    const password = this.dbPassword;
    const database = this.dbName;

    // If host starts with https://, it's likely a Supabase URL without protocol
    if (host.includes('supabase')) {
      return `postgresql://${username}:${password}@${host.replace('https://', '')}:${port}/${database}`;
    }

    return `postgresql://${username}:${password}@${host}:${port}/${database}`;
  }

  // ===== Authentication (JWT) =====
  get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  get jwtExpiration(): string {
    return this.configService.getOrThrow<string>('JWT_EXPIRATION');
  }

  // ===== Queue & Cache (Redis) =====
  get redisUrl(): string {
    return this.configService.getOrThrow<string>('REDIS_URL');
  }

  // ===== Webhooks & Async Processing =====
  get webhookRetryAttempts(): number {
    return this.configService.getOrThrow<number>('WEBHOOK_RETRY_ATTEMPTS');
  }

  get webhookRetryDelay(): number {
    return this.configService.getOrThrow<number>('WEBHOOK_RETRY_DELAY');
  }

  // ===== Collateralization Ratios =====
  /**
   * Minimum collateralization ratio required for new mint operations (150%)
   */
  get collateralRatioMin(): number {
    return this.configService.getOrThrow<number>('COLLATERAL_RATIO_MIN');
  }

  /**
   * Emergency collateralization threshold - critical if below (120%)
   */
  get collateralRatioEmergency(): number {
    return this.configService.getOrThrow<number>('COLLATERAL_RATIO_EMERGENCY');
  }

  // ===== Future: Xahau/XRPL Integration =====
  get xrplNetwork(): string | undefined {
    return this.configService.get<string>('XRPL_NETWORK');
  }

  get xrplWebsocketUrl(): string | undefined {
    return this.configService.get<string>('XRPL_WEBSOCKET_URL');
  }

  get xrplAccount(): string | undefined {
    return this.configService.get<string>('XRPL_ACCOUNT');
  }

  get xrplSecret(): string | undefined {
    return this.configService.get<string>('XRPL_SECRET');
  }

  get isXrplConfigured(): boolean {
    return !!(
      this.xrplNetwork &&
      this.xrplWebsocketUrl &&
      this.xrplAccount &&
      this.xrplSecret
    );
  }
}
