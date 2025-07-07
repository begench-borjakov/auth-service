import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Role } from './role.schema'
import { IRole } from './role.interface'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class RolesRepository {
  private readonly logger = new AppLogger(RolesRepository.name)

  constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) {}

  async create(data: Partial<Role>): Promise<IRole> {
    this.logger.log(` Creating role: ${data.name}`)
    const created = await this.roleModel.create(data)
    this.logger.log(` Created role: ${created.name}`)
    return created.toObject()
  }

  async findById(id: string): Promise<IRole | null> {
    this.logger.log(` Finding role by ID: ${id}`)
    const role = await this.roleModel.findById(new Types.ObjectId(id)).lean<IRole>().exec()
    if (!role) {
      this.logger.warn(` Role not found with ID: ${id}`)
    }
    return role
  }

  async findAll(): Promise<IRole[]> {
    this.logger.log(` Fetching all roles`)
    return this.roleModel.find().lean<IRole[]>().exec()
  }

  async updateById(id: string, data: Partial<Role>): Promise<IRole | null> {
    this.logger.log(` Updating role ID: ${id}`)
    const updated = await this.roleModel
      .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
      .lean<IRole>()
      .exec()
    if (updated) {
      this.logger.log(` Updated role: ${updated.name}`)
    } else {
      this.logger.warn(` Role not found for update: ${id}`)
    }
    return updated
  }

  async deleteById(id: string): Promise<void> {
    this.logger.log(` Deleting role by ID: ${id}`)
    await this.roleModel.findByIdAndDelete(new Types.ObjectId(id)).exec()
    this.logger.log(` Deleted role with ID: ${id}`)
  }
}
