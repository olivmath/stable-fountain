import { PartialType } from '@nestjs/swagger';
import { CreateStablecoinDto } from './create-stablecoin.dto';

export class UpdateStablecoinDto extends PartialType(CreateStablecoinDto) {}
