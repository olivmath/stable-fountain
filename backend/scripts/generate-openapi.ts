import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenAPI() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');

    const config = new DocumentBuilder()
      .setTitle('Fountain API')
      .setDescription('Stablecoin-as-a-Service Platform API')
      .setVersion('0.1.0')
      .addTag('Auth')
      .addTag('Stablecoins')
      .addTag('Operations')
      .addTag('Tokenizers')
      .addTag('Oracle')
      .addTag('Admin')
      .addTag('Blockchain')
      .addTag('Webhooks')
      .addTag('Health')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Write to file
    const outputPath = path.join(__dirname, '..', 'openapi.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

    console.log(`✅ OpenAPI specification generated: ${outputPath}`);
    console.log(`📚 View at: http://localhost:3000/docs`);

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating OpenAPI spec:', error);
    process.exit(1);
  }
}

generateOpenAPI();
