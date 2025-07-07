import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from 'src/auth/decorators/roles.decorator'

export class UserRto {
  @ApiProperty({
    example: '64d2878e3c9a0c1e4b9b1234',
    description: 'Unique user ID',
  })
  @Expose()
  id: string

  @ApiProperty({
    example: 'bega_dev',
    description: 'Username of the user',
  })
  @Expose()
  username: string

  @ApiProperty({
    example: 'bega@example.com',
    description: 'Email address of the user',
  })
  @Expose()
  email: string

  @ApiProperty({
    example: 'user',
    enum: UserRole,
    description: 'Role assigned to the user',
  })
  @Expose()
  role: UserRole
}
