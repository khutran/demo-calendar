import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter, ValidationException } from './exceptions'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  console.log("start .....")
  if (process.env.ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Api documentation')
      .setDescription('Api documentation v1')
      .setVersion('0.1')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)
  }

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      enableDebugMessages: true,
      transform: true,
      disableErrorMessages: configService.get<boolean>('app.isProduction'),
      validationError: { target: false, value: false },
      exceptionFactory: errors => new ValidationException(errors),
    })
  )

  await app.listen(process.env.PORT)
}
bootstrap()
