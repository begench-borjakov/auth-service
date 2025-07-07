import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import {
  ValidationErrorResponse,
  ValidationErrorItem,
} from 'src/common/exceptions/validation-error.interface'

export class CustomValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    const formatted: ValidationErrorItem[] = errors.map((err) => ({
      property: err.property,
      messages: Object.values(err.constraints || {}),
    }))

    const response: ValidationErrorResponse = {
      statusCode: 400,
      error: 'Bad Request',
      message: formatted,
    }

    super(response)
  }
}
