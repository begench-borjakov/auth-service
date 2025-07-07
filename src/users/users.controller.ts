import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserRto } from './rto/user.rto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator'
import { OwnerGuard } from 'src/auth/guards/owner.guard'
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe'
import { AppLogger } from 'src/common/logger/logger.service'

// ✅ Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(UsersController.name)
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'List of users returned', type: [UserRto] })
  async findAll(): Promise<UserRto[]> {
    this.logger.log('[findAll] Получение всех пользователей')
    return this.usersService.findAllUsers()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User found', type: UserRto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<UserRto> {
    this.logger.log(` [findById] id = ${id}`)
    const user = await this.usersService.findById(id)
    if (!user) {
      this.logger.warn(` User not found by ID: ${id}`)
      throw new NotFoundException('User not found')
    }
    this.logger.log(` User found by ID: ${id}`)
    return user
  }

  @Patch(':id')
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, OwnerGuard)
  @ApiOperation({ summary: 'Update own user info' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: UserRto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto
  ): Promise<UserRto> {
    this.logger.log(` [update] id = ${id}, dto = ${JSON.stringify(dto)}`)
    const updated = await this.usersService.updateUser(id, dto)
    this.logger.log(` User updated: ${id}`)
    return updated
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Delete own user account' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<{ message: string }> {
    this.logger.log(`[delete] id = ${id}`)
    await this.usersService.deleteUser(id)
    this.logger.log(` User deleted: ${id}`)
    return { message: 'User deleted successfully' }
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async adminDelete(@Param('id', ParseObjectIdPipe) id: string): Promise<{ message: string }> {
    this.logger.log(`[adminDelete] id = ${id}`)
    await this.usersService.deleteUser(id)
    this.logger.log(`User deleted by ADMIN: ${id}`)
    return { message: 'User deleted successfully' }
  }
}
