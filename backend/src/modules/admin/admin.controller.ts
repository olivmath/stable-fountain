import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create new admin account' })
  @ApiResponse({
    status: 201,
    description: 'Admin account created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Admin email already exists',
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all admin accounts' })
  @ApiResponse({
    status: 200,
    description: 'Admin accounts retrieved',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin account by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin account retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin account not found',
  })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin account' })
  @ApiResponse({
    status: 200,
    description: 'Admin account updated',
  })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin account' })
  @ApiResponse({
    status: 200,
    description: 'Admin account deleted',
  })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
