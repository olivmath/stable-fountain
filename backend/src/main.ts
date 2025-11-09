import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/env/config.service';

/**
 * Bootstrap function
 *
 * Initialization sequence:
 * 1. Create NestJS application (ConfigModule is loaded first as @Global)
 * 2. ConfigModule validates all environment variables against Joi schema
 * 3. Setup global pipes and middleware
 * 4. Configure API documentation (Swagger)
 * 5. Start listening on configured port
 *
 * If configuration validation fails, the app exits with a clear error from Joi
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Step 1: Create NestJS application
    // The ConfigModule will be loaded first (as it's @Global)
    // and will validate all env vars against the Joi schema
    // If any required variable is missing, this will throw a validation error
    logger.log('📦 Initializing NestJS application...');
    const app = await NestFactory.create(AppModule);

    // Step 3: Setup global prefix and validation
    app.setGlobalPrefix('api/v1');

    // Global validation pipe for request DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Enable CORS
    app.enableCors();

    // Step 4: Setup Swagger/OpenAPI documentation
    logger.log('📚 Setting up API documentation...');
    const config = new DocumentBuilder()
      .setTitle('Fountain API')
      .setDescription(
        'Stablecoin-as-a-Service Platform API - Peggy Protocol',
      )
      .setVersion('0.1.0')
      .addTag('Stablecoins')
      .addTag('Operations')
      .addTag('Tokenizers')
      .addTag('Oracle')
      .addTag('Admin')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Step 5: Get configuration and start listening
    const configService = app.get(ConfigService);
    const port = configService.port;
    const environment = configService.nodeEnv;

    await app.listen(port);

    // Success! Print startup information
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                   🌊 FOUNTAIN API STARTED                       ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log(`  ✅ Environment:     ${environment}`);
    console.log(`  🔌 Port:           ${port}`);
    console.log(`  🌐 API:            http://localhost:${port}/api/v1`);
    console.log(`  📚 Docs:           http://localhost:${port}/docs`);
    console.log('\n');
  } catch (error) {
    // Error handling for startup failures
    const logger = new Logger('Bootstrap');

    logger.error('Fatal error during application startup');
    console.error('\n');
    console.error('═'.repeat(64));
    console.error('Application initialization failed:');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('═'.repeat(64));
    console.error('\n');

    process.exit(1);
  }
}

// Start the application
bootstrap().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
