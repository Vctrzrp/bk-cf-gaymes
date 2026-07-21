import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; originalUrl: string }>()
    const response = context.switchToHttp().getResponse<{ statusCode: number }>()
    const startedAt = Date.now()

    this.logger.log(`→ ${request.method} ${request.originalUrl}`)
    return next.handle().pipe(tap({
      next: () => this.logger.log(
        `← ${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`
      ),
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Error desconocido'
        this.logger.error(
          `× ${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms - ${message}`
        )
      }
    }))
  }
}

