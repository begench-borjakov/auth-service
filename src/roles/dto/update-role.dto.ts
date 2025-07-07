import { IsOptional, IsString, IsArray } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateRoleDto {
  @ApiPropertyOptional({
    example: 'editor',
    description: 'New name of the role (optional)',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: ['read_articles', 'edit_articles'],
    description: 'Updated list of permissions (optional)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[]

  @ApiPropertyOptional({
    example: 'Role responsible for managing content',
    description: 'Description of the role (optional)',
  })
  @IsOptional()
  @IsString()
  description?: string
}
