import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // <<< ADICIONE ESTA LINHA AQUI:
  app.enableCors();

  await app.listen(3000); // Mantenha 3000 ou process.env.PORT
}
bootstrap();
