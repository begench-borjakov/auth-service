import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Role, RoleSchema } from 'src/database/role/role.schema'
import { RolesRepository } from 'src/database/role/role.repository'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { AppLogger } from 'src/common/logger/logger.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  providers: [RolesService, RolesRepository, AppLogger],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
