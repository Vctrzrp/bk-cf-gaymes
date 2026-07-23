import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.user.findUnique({ where: { username: dto.username } })
    const valid = admin && await bcrypt.compare(dto.password, admin.passwordHash)

    if (!valid) {
      this.logger.warn(`Intento de autenticación fallido para usuario=${dto.username}`)
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const user = { id: admin.id, username: admin.username, name: admin.name }
    const token = await this.jwtService.signAsync({ sub: user.id, username: user.username, name: user.name })
    this.logger.log(`Inicio de sesión correcto para usuario=${dto.username}`)
    return { token, accessToken: token, user }
  }
}
