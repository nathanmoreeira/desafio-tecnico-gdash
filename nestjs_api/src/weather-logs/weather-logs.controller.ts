import { Controller, Post, Body, Get } from '@nestjs/common';
import { WeatherLogsService } from './weather-logs.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';

@Controller('api/weather/logs')
export class WeatherLogsController {
  constructor(private readonly weatherLogsService: WeatherLogsService) {}

  @Post()
  async create(@Body() createWeatherLogDto: CreateWeatherLogDto) {
    await this.weatherLogsService.create(createWeatherLogDto);
    return { status: 'success', message: 'Log salvo com sucesso' };
  }

  @Get()
  findAll() {
    return this.weatherLogsService.findAll();
  }

  // <<< NOVO ENDPOINT DE IA >>>
  // Acessível em: GET /api/weather/logs/insights
  @Get('insights')
  getInsights() {
    return this.weatherLogsService.getInsights();
  }
}
