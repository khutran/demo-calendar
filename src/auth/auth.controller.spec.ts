import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.guards'
import { JwtStrategy } from './jwt.strategy'

describe('AuthController', () => {
  let controller: AuthController
  let mockConfigService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [AuthService],
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mock secret'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        JwtStrategy,
        AuthService,
        JwtAuthGuard,
      ],
    }).compile()
    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
