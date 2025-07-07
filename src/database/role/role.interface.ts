import { Types } from 'mongoose'

export interface IRoleBase {
  name: string
  permissions: string[]
  description?: string
}

export interface IRole extends IRoleBase {
  _id: Types.ObjectId
}
