import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherLogsModule } from './weather-logs/weather-logs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/gdash_db'),
    WeatherLogsModule, // CRÍTICO: Usa o nome do serviço 'mongodb'
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
