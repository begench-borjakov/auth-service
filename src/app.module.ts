import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppLogger } from './common/logger/logger.service'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    UsersModule,
    RolesModule,
    AuthModule,
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppModule {}
