import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';

@Injectable()
export class WeatherLogsService {
  constructor(
    @InjectModel(WeatherLog.name)
    private readonly weatherLogModel: Model<WeatherLogDocument>,
  ) {}

  async create(createWeatherLogDto: CreateWeatherLogDto): Promise<WeatherLog> {
    const createdLog = new this.weatherLogModel(createWeatherLogDto);
    return createdLog.save();
  }

  async findAll(): Promise<WeatherLog[]> {
    return this.weatherLogModel.find().sort({ timestamp: -1 }).exec();
  }

  // FUNÇÃO IA SIMBÓLICA (INSIGHTS)
  async getInsights() {
    // 1. Busca os últimos 10 registros para análise
    const logs = await this.weatherLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();

    if (!logs || logs.length < 2) {
      return {
        status: 'Insuficiente',
        message: 'Aguardando mais dados para gerar insights...',
      };
    }

    // 2. Cálculo Estatístico (Média)
    const sum = logs.reduce((acc, curr) => acc + curr.temperature_c, 0);
    const avg = sum / logs.length;

    // 3. Análise de Tendência (Comparando o mais recente com o mais antigo da amostra)
    const current = logs[0].temperature_c; // Mais recente
    const old = logs[logs.length - 1].temperature_c; // Mais antigo (dos 10)

    let trend = 'Estabilidade Térmica ⏸️';
    if (current > old + 0.5) trend = 'Tendência de Aquecimento 📈';
    if (current < old - 0.5) trend = 'Tendência de Resfriamento 📉';

    // 4. Regras de Alerta
    let alert = 'Condições Normais ✅';
    if (current > 32) alert = 'ALERTA: Calor Excessivo 🔥';
    if (current < 15) alert = 'ALERTA: Baixa Temperatura ❄️';

    return {
      city: logs[0].city,
      latest_temp: current,
      average_10_readings: parseFloat(avg.toFixed(1)),
      trend: trend,
      alert: alert,
      analysis_timestamp: new Date().toISOString(),
    };
  }
}
