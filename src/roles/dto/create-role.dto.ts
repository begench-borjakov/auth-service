import { IsString, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({
    example: 'manager',
    description: 'Unique name of the role',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: ['read_users', 'delete_users'],
    description: 'List of permissions assigned to the role',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[]

  @ApiProperty({
    example: 'Role with elevated privileges for managing users',
    description: 'Optional description of the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string
}
