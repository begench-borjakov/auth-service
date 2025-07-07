import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../decorators/roles.decorator'

export class MeRto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID',
  })
  sub: string

  @ApiProperty({
    example: 'bega@example.com',
    description: 'User email address',
  })
  email: string

  @ApiProperty({
    example: 'bega_dev',
    description: 'Username',
  })
  username: string

  @ApiProperty({
    example: 'user',
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole
}
