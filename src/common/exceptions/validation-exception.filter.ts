import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Response } from 'express'
import { ValidationErrorResponse } from '../exceptions/validation-error.interface'

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception.getStatus()
    const rawResponse = exception.getResponse()

    const isValidationArray =
      typeof rawResponse === 'object' &&
      rawResponse !== null &&
      Array.isArray((rawResponse as any).message)

    if (isValidationArray) {
      // Тут уже message: ValidationErrorItem[]
      const payload: ValidationErrorResponse = {
        statusCode: status,
        error: 'Bad Request',
        message: (rawResponse as any).message,
      }

      response.status(status).json(payload)
    } else {
      response
        .status(status)
        .json(
          typeof rawResponse === 'object'
            ? rawResponse
            : { statusCode: status, message: rawResponse }
        )
    }
  }
}
