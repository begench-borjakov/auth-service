export interface ValidationConstraintMap {
  [constraintName: string]: string
}

export interface ValidationErrorItem {
  property: string
  messages: string[]
}

export interface ValidationErrorResponse {
  statusCode: number
  message: ValidationErrorItem[] | string
  error: string
}
