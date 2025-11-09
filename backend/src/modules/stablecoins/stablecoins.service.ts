import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStablecoinDto } from './dto/create-stablecoin.dto';
import { UpdateStablecoinDto } from './dto/update-stablecoin.dto';
import { Stablecoin } from './entities/stablecoin.entity';

@Injectable()
export class StablecoinsService {
  constructor(
    @InjectRepository(Stablecoin)
    private stablecoinRepository: Repository<Stablecoin>,
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
}
