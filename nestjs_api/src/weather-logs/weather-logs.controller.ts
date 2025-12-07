import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { WeatherLogsService } from './weather-logs.service';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/weather/logs')
export class WeatherLogsController {
  constructor(private readonly weatherLogsService: WeatherLogsService) {}

  // Rota de criação
  @Post()
  async create(@Body() createWeatherLogDto: CreateWeatherLogDto) {
    await this.weatherLogsService.create(createWeatherLogDto);
    return { status: 'success', message: 'Log salvo com sucesso' };
  }

  // <<< ROTA PROTEGIDA >>>
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.weatherLogsService.findAll();
  }

  // <<< ROTA PROTEGIDA >>>
  @UseGuards(AuthGuard('jwt'))
  @Get('insights')
  getInsights() {
    return this.weatherLogsService.getInsights();
  }
}
