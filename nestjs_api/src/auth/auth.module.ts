import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'SEGREDO_SUPER_SECRETO_GDASH',
      signOptions: { expiresIn: '60m' }, // Token expira em 1 hora
    }),
  ],
  controllers: [AuthController], // Registra o controlador
  providers: [AuthService, LocalStrategy, JwtStrategy], // Registra as regras
  exports: [AuthService],
})
export class AuthModule {}
