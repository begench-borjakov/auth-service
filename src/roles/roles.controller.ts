import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleRto } from './rto/role.rto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator'
import { AppLogger } from 'src/common/logger/logger.service'
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe'

// ✅ Swagger decorators
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(RolesController.name)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role (Admin only)' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created', type: RoleRto })
  async create(@Body() dto: CreateRoleDto): Promise<RoleRto> {
    this.logger.log(`[POST] /roles — creating role: ${dto.name}`)
    return this.rolesService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of roles', type: [RoleRto] })
  async findAll(): Promise<RoleRto[]> {
    this.logger.log(`[GET] /roles — retrieving all roles`)
    return this.rolesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Role found', type: RoleRto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<RoleRto> {
    this.logger.log(`[GET] /roles/${id} — retrieving role`)
    return this.rolesService.findById(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated', type: RoleRto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRoleDto
  ): Promise<RoleRto> {
    this.logger.log(`[PATCH] /roles/${id} — updating role`)
    return this.rolesService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role by ID (Admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<{ message: string }> {
    this.logger.log(`[DELETE] /roles/${id} — deleting role`)
    await this.rolesService.delete(id)
    return { message: 'Role deleted successfully' }
  }
}
