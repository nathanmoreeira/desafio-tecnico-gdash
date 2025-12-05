import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema()
export class WeatherLog {
  // O MongooseModule usa esta string para o nome da collection no MongoDB.
  // Será 'weatherlogs' no plural.

  @Prop({ required: true, index: true })
  timestamp: number;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, type: Number })
  temperature_c: number;

  @Prop()
  weather_code: number;

  // Você pode adicionar mais campos aqui, como 'ia_insights' (futura Tarefa 14)
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
