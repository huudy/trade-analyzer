import { Injectable } from '@nestjs/common';
import Binance, {
  Binance as BinanceClient,
  CandleChartInterval_LT,
} from 'binance-api-node';
@Injectable()
export class BinanceService {
  private client: BinanceClient;

  constructor() {
    this.client = Binance();
  }

  async fetchHistoryData(symbol: string, interval: CandleChartInterval_LT) {
    return this.client.candles({
      symbol,
      interval,
    });
  }
}
