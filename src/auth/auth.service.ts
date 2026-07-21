import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly admin = {
    id: 'admin-1',
    username: 'admin',
    name: 'Administrador',
    passwordHash: bcrypt.hashSync('admin123', 10)
  }

  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const valid = dto.username === this.admin.username
      && await bcrypt.compare(dto.password, this.admin.passwordHash)

    if (!valid) {
      this.logger.warn(`Intento de autenticación fallido para usuario=${dto.username}`)
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const user = { id: this.admin.id, username: this.admin.username, name: this.admin.name }
    const token = await this.jwtService.signAsync({ sub: user.id, username: user.username, name: user.name })
    this.logger.log(`Inicio de sesión correcto para usuario=${dto.username}`)
    return { token, accessToken: token, user }
  }
}

