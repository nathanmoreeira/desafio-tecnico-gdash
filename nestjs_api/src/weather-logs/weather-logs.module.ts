import { Module } from '@nestjs/common';
import { WeatherLogsService } from './weather-logs.service';
import { WeatherLogsController } from './weather-logs.controller';
import { MongooseModule } from '@nestjs/mongoose'; // NOVO
import { WeatherLog, WeatherLogSchema } from './schemas/weather-log.schema'; // NOVO

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema }, // NOVO
    ]),
  ],
  controllers: [WeatherLogsController],
  providers: [WeatherLogsService],
})
export class WeatherLogsModule {}
