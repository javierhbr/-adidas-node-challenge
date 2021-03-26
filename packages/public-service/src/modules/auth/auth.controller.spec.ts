import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('LoginController', () => {
  let controller: AuthController;

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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should Login and return JWT', async () => {
      const loginRequest = {
        username: 'test@gmail.com',
        password: 'Abcd1234',
      };

      const response = await controller.signIn(loginRequest);
      expect(response).toBeDefined();
      expect(response.accessToken).toBeDefined();
    });
  });
});
