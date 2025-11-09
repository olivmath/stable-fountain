import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';

@ApiTags('Webhooks')
@ApiBearerAuth('access-token')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Subscribe to webhook events' })
  @ApiResponse({
    status: 201,
    description: 'Webhook subscription created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook configuration',
  })
  create(@Body() createWebhookDto: CreateWebhookDto) {
    return this.webhooksService.create(createWebhookDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all webhook subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'Webhooks retrieved',
  })
  findAll() {
    return this.webhooksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webhook subscription by ID' })
  @ApiResponse({
    status: 200,
    description: 'Webhook retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Webhook not found',
  })
  findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update webhook subscription' })
  @ApiResponse({
    status: 200,
    description: 'Webhook updated',
  })
  update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhooksService.update(+id, updateWebhookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webhook subscription' })
  @ApiResponse({
    status: 200,
    description: 'Webhook deleted',
  })
  remove(@Param('id') id: string) {
    return this.webhooksService.remove(+id);
  }
}
