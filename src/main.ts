import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const config = app.get(ConfigService)
  const logger = new Logger('Bootstrap')
  const prefix = config.get<string>('API_PREFIX', 'api')
  const port = config.get<number>('PORT', 8080)
  const origins = config.get<string>('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())

  // Swagger UI utiliza scripts embebidos; el resto de cabeceras de Helmet sigue activo.
  app.use(helmet({ contentSecurityPolicy: false }))
  app.setGlobalPrefix(prefix)
  app.enableCors({
    origin: origins,
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Total-Count']
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Crossfit Gaymes API')
    .setDescription('API administrativa y pública de Crossfit Gaymes')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`${prefix}/docs`, app, document)

  await app.listen(port, '0.0.0.0')
  logger.log(`API disponible en http://localhost:${port}/${prefix}`)
  logger.log(`Swagger disponible en http://localhost:${port}/${prefix}/docs`)
  logger.log('Persistencia PostgreSQL activa mediante Prisma')
}

void bootstrap()
