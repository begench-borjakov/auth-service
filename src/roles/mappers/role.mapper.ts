import { plainToInstance } from 'class-transformer'
import { IRole } from 'src/database/role/role.interface'
import { RoleRto } from '../rto/role.rto'

export function mapToRoleRto(role: IRole): RoleRto {
  return plainToInstance(
    RoleRto,
    {
      id: role._id.toString(),
      name: role.name,
      permissions: role.permissions,
      description: role.description,
    },
    {
      excludeExtraneousValues: true,
    }
  )
}
