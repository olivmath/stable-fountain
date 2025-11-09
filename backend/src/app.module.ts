import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

import { ConfigModule } from './config/env/config.module';
import { ConfigService } from './config/env/config.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenizersModule } from './modules/tokenizers/tokenizers.module';
import { StablecoinsModule } from './modules/stablecoins/stablecoins.module';
import { OperationsModule } from './modules/operations/operations.module';
import { OracleModule } from './modules/oracle/oracle.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        databaseConfig(configService),
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    TokenizersModule,
    StablecoinsModule,
    OperationsModule,
    OracleModule,
    BlockchainModule,
    WebhooksModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
