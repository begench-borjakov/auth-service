// src/common/interceptors/http-logger.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { AppLogger } from '../logger/logger.service'

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request & { method: string; url: string }>()
    const method = req.method
    const url = req.url
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now
        this.logger.log(`[${method}] ${url} - ${time}ms`, 'HTTP')
      })
    )
  }
}
