import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { UsersRepository } from '../database/user/user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { hashPassword } from '../common/utils/hash.util'
import { mapToUserRto } from './mappers/user.mapper'
import { UserRto } from './rto/user.rto'
import { IUser } from 'src/database/user/user.interface'
import { UserRole } from 'src/auth/decorators/roles.decorator'
import { AppLogger } from 'src/common/logger/logger.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(UsersService.name)
  }

  async findAllUsers(): Promise<UserRto[]> {
    this.logger.log('Fetching all users')
    const users = await this.usersRepository.findAll()
    return users.map(mapToUserRto)
  }

  async findEntityByEmail(email: string): Promise<IUser | null> {
    this.logger.debug(`Searching for user by email: ${email}`)
    return this.usersRepository.findByEmail(email)
  }

  async findByEmail(email: string): Promise<UserRto | null> {
    this.logger.debug(`Finding user DTO by email: ${email}`)
    const user = await this.findEntityByEmail(email)
    return user ? mapToUserRto(user) : null
  }

  async findById(id: string): Promise<UserRto | null> {
    this.logger.debug(`Finding user by ID: ${id}`)
    const user = await this.usersRepository.findById(id)
    return user ? mapToUserRto(user) : null
  }

  async findEntityById(id: string): Promise<IUser | null> {
    this.logger.debug(`Finding user entity by ID: ${id}`)
    return this.usersRepository.findById(id)
  }

  async createUserEntity(dto: CreateUserDto & { role: UserRole }): Promise<IUser> {
    this.logger.log(`Creating user: ${dto.email}`)

    const existing = await this.findEntityByEmail(dto.email)
    if (existing) {
      this.logger.warn(`Attempt to create user that already exists: ${dto.email}`)
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await hashPassword(dto.password)
    const newUser: IUser = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    })

    this.logger.log(`User created: ${dto.email}`)
    return newUser
  }

  async updateRefreshToken(userId: string, token: string): Promise<void> {
    this.logger.debug(`Updating refresh token for user ID: ${userId}`)
    return this.usersRepository.updateRefreshToken(userId, token)
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserRto> {
    this.logger.log(`Updating user: ${id}`)
    const updatedUser = await this.usersRepository.updateById(id, dto)
    if (!updatedUser) {
      this.logger.warn(`User not found for update: ${id}`)
      throw new NotFoundException('User not found')
    }

    this.logger.log(`User updated: ${id}`)
    return mapToUserRto(updatedUser)
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`)
    const user = await this.usersRepository.findById(id)
    if (!user) {
      this.logger.warn(`User not found for deletion: ${id}`)
      throw new NotFoundException('User not found')
    }

    await this.usersRepository.deleteById(id)
    this.logger.log(`User deleted: ${id}`)
  }
}
