import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenizersService } from './tokenizers.service';
import { TokenizersController } from './tokenizers.controller';
import { Tokenizer } from './entities/tokenizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tokenizer])],
  controllers: [TokenizersController],
  providers: [TokenizersService],
  exports: [TokenizersService],
})
export class TokenizersModule {}
