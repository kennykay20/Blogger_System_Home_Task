import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configs } from './config';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json());
  app.use(cookieParser());

  const corsOption = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['set-cookie', 'Set-Cookie'],
  };

  app.enableCors(corsOption);

  const config = new DocumentBuilder()
    .setTitle('Blogger_api')
    .setDescription('The Rest api for Blogger Home Task ')
    .setVersion('1.0')
    .addTag('blogger_api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('API', app, document);

  await app.listen(configs.port.http_port, () =>
    console.log(`app running on port ${configs.port.http_port}`),
  );
}
bootstrap();
