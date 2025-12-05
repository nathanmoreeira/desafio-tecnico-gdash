import { Test, TestingModule } from '@nestjs/testing';
import { WeatherLogsController } from './weather-logs.controller';
import { WeatherLogsService } from './weather-logs.service';

describe('WeatherLogsController', () => {
  let controller: WeatherLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherLogsController],
      providers: [WeatherLogsService],
    }).compile();

    controller = module.get<WeatherLogsController>(WeatherLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
