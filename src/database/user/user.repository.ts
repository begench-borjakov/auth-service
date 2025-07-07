import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, HydratedDocument } from 'mongoose'
import { User } from './user.schema'
import { IUser } from './user.interface'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class UsersRepository {
  private readonly logger = new AppLogger(UsersRepository.name)

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(data: Partial<User>): Promise<IUser> {
    this.logger.log(` Creating user: ${data.email}`)
    const created: HydratedDocument<User> = await this.userModel.create(data)
    this.logger.log(` Created user: ${created.email}`)
    return created.toObject()
  }

  async findAll(): Promise<IUser[]> {
    this.logger.log('Fetching all users')
    const users = await this.userModel.find().lean<IUser[]>()
    this.logger.log(`Found ${users.length} users`)
    return users
  }

  async findByEmail(email: string): Promise<IUser | null> {
    this.logger.log(` Finding user by email: ${email}`)
    const user = await this.userModel.findOne({ email }).lean<IUser>().exec()
    if (!user) {
      this.logger.warn(` User not found with email: ${email}`)
    }
    return user
  }

  async findById(id: string): Promise<IUser | null> {
    this.logger.log(` Finding user by ID: ${id}`)
    const user = await this.userModel.findById(new Types.ObjectId(id)).lean<IUser>().exec()
    if (!user) {
      this.logger.warn(` User not found with ID: ${id}`)
    }
    return user
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    this.logger.log(` Updating refresh token for user ID: ${userId}`)
    await this.userModel
      .updateOne({ _id: new Types.ObjectId(userId) }, { $set: { refreshToken } })
      .exec()
    this.logger.log(` Refresh token updated for user ID: ${userId}`)
  }

  async updateById(id: string, data: Partial<User>): Promise<IUser | null> {
    this.logger.log(` Updating user ID: ${id}`)
    const updated = await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
      .lean<IUser>()
      .exec()
    if (updated) {
      this.logger.log(` Updated user: ${updated.email}`)
    } else {
      this.logger.warn(` Failed to update. User not found with ID: ${id}`)
    }
    return updated
  }

  async deleteById(id: string): Promise<void> {
    this.logger.log(` Deleting user by ID: ${id}`)
    await this.userModel.findByIdAndDelete(new Types.ObjectId(id)).exec()
    this.logger.log(` Deleted user with ID: ${id}`)
  }
}
