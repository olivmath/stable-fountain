import { IsString, IsUrl, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebhookDto {
  @ApiProperty({
    example: 'https://acme.com/fountain-webhook',
    description: 'Webhook URL to deliver events',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    example: 'operation.completed',
    enum: ['operation.completed', 'operation.failed', 'pool.updated'],
    description: 'Event type to subscribe',
  })
  @IsEnum(['operation.completed', 'operation.failed', 'pool.updated'])
  eventType: string;

  @ApiProperty({
    example: 'secret_webhook_key_12345',
    description: 'Secret key for signing webhook payloads',
  })
  @IsString()
  secret: string;

  @ApiProperty({
    example: 'Operation completed successfully',
    description: 'Description of webhook',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
