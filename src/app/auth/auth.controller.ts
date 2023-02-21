import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	@Post('login')
	@HttpCode(200)
	login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}
}
