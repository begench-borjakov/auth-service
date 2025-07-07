import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class RoleRto {
  @ApiProperty({
    example: '64b83c987c65ec08b4e9a4b1',
    description: 'Unique identifier of the role',
  })
  @Expose()
  id: string

  @ApiProperty({
    example: 'manager',
    description: 'Name of the role',
  })
  @Expose()
  name: string

  @ApiProperty({
    example: ['read_users', 'delete_users'],
    description: 'Permissions associated with the role',
    type: [String],
  })
  @Expose()
  permissions: string[]

  @ApiProperty({
    example: 'Role with access to user management',
    description: 'Optional description of the role',
    required: false,
  })
  @Expose()
  description?: string
}
