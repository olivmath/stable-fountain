import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // bcrypt still used in register method
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CustomLogger } from '../../common/logger.service';
import { ConfigService } from '../../config/env/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private logger: CustomLogger,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.logOperationStart('REGISTER', { email: registerDto.email, name: registerDto.name });

      const { email, password, name } = registerDto;

      // Step 1: Check if user already exists
      this.logger.logStep(1, 'Checking if email already exists', { email });
      const existingUser = await this.userRepository.findOne({ where: { email } });

      this.logger.logValidation('Email availability', !existingUser, {
        found: existingUser ? 'Email exists' : 'Email available'
      });

      if (existingUser) {
        this.logger.logWarning('Registration failed - Email already registered', { email });
        throw new ConflictException('Email already registered');
      }

      // Step 2: Hash password
      this.logger.logStep(2, 'Hashing password with bcrypt (10 salt rounds)');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      this.logger.logInfo('Password hashed successfully');

      // Step 3: Create new user object
      this.logger.logStep(3, 'Creating new user entity', { email, name });
      const user = this.userRepository.create({
        email,
        name,
        password: hashedPassword,
        role: 'user',
        isActive: true,
      });

      // Step 4: Save user to database
      this.logger.logStep(4, 'Saving user to database');
      const savedUser = await this.userRepository.save(user);
      this.logger.logDataCreated('USER', savedUser.id, { email, name, role: savedUser.role });

      // Step 5: Prepare response
      this.logger.logStep(5, 'Preparing response (password excluded)');
      const response = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
      };

      this.logger.logOperationSuccess('REGISTER', response);
      return response;

    } catch (error) {
      this.logger.logOperationError('REGISTER', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      this.logger.logOperationStart('LOGIN', { email: loginDto.email });

      const { email } = loginDto;

      // Step 1: Find user by email
      this.logger.logStep(1, 'Looking up user by email', { email });
      const user = await this.userRepository.findOne({ where: { email } });

      this.logger.logValidation('User exists', !!user, {
        status: user ? 'Found' : 'Not found'
      });

      if (!user) {
        this.logger.logWarning('Login failed - User not found', { email });
        throw new UnauthorizedException('User not found');
      }

      // Step 2: Check if user is active
      this.logger.logStep(2, 'Checking user account status', { isActive: user.isActive });

      this.logger.logValidation('Account active', user.isActive, {
        status: user.isActive ? 'Active' : 'Inactive'
      });

      if (!user.isActive) {
        this.logger.logWarning('Login failed - User account inactive', { email });
        throw new UnauthorizedException('User account is inactive');
      }

      // Step 3: Generate JWT token
      this.logger.logStep(3, 'Generating JWT token');
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);

      this.logger.logInfo('JWT token generated successfully', {
        expiresIn: this.configService.jwtExpiration
      });

      // Step 4: Prepare response
      this.logger.logStep(4, 'Preparing login response');
      const response = {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };

      this.logger.logOperationSuccess('LOGIN', {
        userId: user.id,
        email: user.email,
        tokenExpires: this.configService.jwtExpiration
      });

      return response;

    } catch (error) {
      this.logger.logOperationError('LOGIN', error);
      throw error;
    }
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Legacy methods for compatibility
  create(createAuthDto: any) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
