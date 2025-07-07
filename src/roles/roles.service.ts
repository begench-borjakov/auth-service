import { Injectable, NotFoundException } from '@nestjs/common'
import { RolesRepository } from 'src/database/role/role.repository'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleRto } from './rto/role.rto'
import { mapToRoleRto } from './mappers/role.mapper'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepo: RolesRepository,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(RolesService.name)
  }

  async create(dto: CreateRoleDto): Promise<RoleRto> {
    const role = await this.rolesRepo.create(dto)
    this.logger.log(`New role created: ${role.name}`)
    return mapToRoleRto(role)
  }

  async findAll(): Promise<RoleRto[]> {
    const roles = await this.rolesRepo.findAll()
    this.logger.log(`Retrieved all roles (count: ${roles.length})`)
    return roles.map(mapToRoleRto)
  }

  async findById(id: string): Promise<RoleRto> {
    const role = await this.rolesRepo.findById(id)
    if (!role) {
      this.logger.warn(`Role not found with ID: ${id}`)
      throw new NotFoundException('Role not found')
    }
    this.logger.log(`Role retrieved by ID: ${id}`)
    return mapToRoleRto(role)
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleRto> {
    const updated = await this.rolesRepo.updateById(id, dto)
    if (!updated) {
      this.logger.warn(`Failed to update role. Role not found with ID: ${id}`)
      throw new NotFoundException('Role not found')
    }
    this.logger.log(`Role updated successfully: ID ${id}`)
    return mapToRoleRto(updated)
  }

  async delete(id: string): Promise<void> {
    const existing = await this.rolesRepo.findById(id)
    if (!existing) {
      this.logger.warn(`Attempted to delete non-existent role: ID ${id}`)
      throw new NotFoundException('Role not found')
    }
    await this.rolesRepo.deleteById(id)
    this.logger.log(`Role deleted: ID ${id}`)
  }
}
