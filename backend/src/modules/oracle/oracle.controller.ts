import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OracleService } from './oracle.service';
import { CreateOracleDto } from './dto/create-oracle.dto';
import { UpdateOracleDto } from './dto/update-oracle.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Oracle')
@Controller('oracle')
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Add exchange rate data' })
  @ApiResponse({
    status: 201,
    description: 'Exchange rate recorded',
  })
  create(@Body() createOracleDto: CreateOracleDto) {
    return this.oracleService.create(createOracleDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get latest exchange rates' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rates retrieved',
  })
  findAll() {
    return this.oracleService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get exchange rate by ID' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rate retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Exchange rate not found',
  })
  findOne(@Param('id') id: string) {
    return this.oracleService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update exchange rate' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rate updated',
  })
  update(@Param('id') id: string, @Body() updateOracleDto: UpdateOracleDto) {
    return this.oracleService.update(+id, updateOracleDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete exchange rate' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rate deleted',
  })
  remove(@Param('id') id: string) {
    return this.oracleService.remove(+id);
  }
}
