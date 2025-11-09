import { PartialType } from '@nestjs/swagger';
import { CreateTokenizerDto } from './create-tokenizer.dto';

export class UpdateTokenizerDto extends PartialType(CreateTokenizerDto) {}
