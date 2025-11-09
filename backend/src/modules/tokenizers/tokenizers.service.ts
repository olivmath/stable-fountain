import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenizerDto } from './dto/create-tokenizer.dto';
import { UpdateTokenizerDto } from './dto/update-tokenizer.dto';
import { Tokenizer } from './entities/tokenizer.entity';
import * as crypto from 'crypto';

@Injectable()
export class TokenizersService {
  constructor(
    @InjectRepository(Tokenizer)
    private tokenizerRepository: Repository<Tokenizer>,
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
}
