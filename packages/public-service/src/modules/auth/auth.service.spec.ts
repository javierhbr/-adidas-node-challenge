import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthErrorException } from '../exceptions';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secrete',
          signOptions: {
            expiresIn: 518400,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return error with invalid username', async () => {
      const loginRequest = {
        username: null,
        password: 'Abcd1234',
      };

      // const response = await authService.signIn(loginRequest);
      await expect(authService.signIn(loginRequest)).rejects.toThrow(
        AuthErrorException,
      );
    });

    it('should Login and return JWT', async () => {
      const loginRequest = {
        username: 'test@gmail.com',
        password: 'Abcd1234',
      };

      const response = await authService.signIn(loginRequest);
      expect(response).toBeDefined();
      expect(response.accessToken).toBeDefined();
    });
  });
});
