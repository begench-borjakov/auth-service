import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User, UserSchema } from '../database/user/user.schema'
import { UsersRepository } from '../database/user/user.repository'
import { AppLogger } from 'src/common/logger/logger.service' // ✅ добавляем импорт

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, UsersRepository, AppLogger], // ✅ добавляем логгер
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
