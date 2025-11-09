import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@ApiTags('Operations')
@ApiBearerAuth('access-token')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new operation (mint/burn)' })
  @ApiResponse({
    status: 201,
    description: 'Operation created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid operation parameters',
  })
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsService.create(createOperationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all operations' })
  @ApiResponse({
    status: 200,
    description: 'Operations retrieved successfully',
  })
  findAll() {
    return this.operationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get operation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Operation retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Operation not found',
  })
  findOne(@Param('id') id: string) {
    return this.operationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update operation status' })
  @ApiResponse({
    status: 200,
    description: 'Operation updated successfully',
  })
  update(@Param('id') id: string, @Body() updateOperationDto: UpdateOperationDto) {
    return this.operationsService.update(+id, updateOperationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel operation' })
  @ApiResponse({
    status: 200,
    description: 'Operation deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.operationsService.remove(+id);
  }
}
