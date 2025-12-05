import { Test, TestingModule } from '@nestjs/testing';
import { WeatherLogsService } from './weather-logs.service';

describe('WeatherLogsService', () => {
  let service: WeatherLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherLogsService],
    }).compile();

    service = module.get<WeatherLogsService>(WeatherLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
