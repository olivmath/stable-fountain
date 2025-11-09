import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StablecoinsService } from './stablecoins.service';
import { StablecoinsController } from './stablecoins.controller';
import { Stablecoin } from './entities/stablecoin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stablecoin])],
  controllers: [StablecoinsController],
  providers: [StablecoinsService],
  exports: [StablecoinsService],
})
export class StablecoinsModule {}
