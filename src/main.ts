import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { CustomValidationException } from './common/exceptions/custom-validation.exception'
import { ValidationExceptionFilter } from './common/exceptions/validation-exception.filter'
import { HttpAdapterHost } from '@nestjs/core'
import { AppLogger } from './common/logger/logger.service'
import { HttpLoggerInterceptor } from './common/interceptors/http-logger.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const logger = app.get(AppLogger)
  app.useLogger(logger)

  app.useGlobalInterceptors(new HttpLoggerInterceptor(logger))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new CustomValidationException(errors),
    })
  )

  const adapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new ValidationExceptionFilter(adapterHost))

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Документация API сервиса аутентификации')
    .setVersion('1.0')
    .addBearerAuth() // поддержка JWT
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = 3000
  await app.listen(port)
  logger.log(`🚀 Server started on http://localhost:${port}`, 'Bootstrap')
  logger.log(`📘 Swagger docs available at http://localhost:${port}/api/docs`, 'Bootstrap')
}

bootstrap()
