import { Injectable } from '@nestjs/common';
import BinanceFactory, {
  Binance as BinanceClient,
  CandleChartInterval_LT,
} from 'binance-api-node';
@Injectable()
export class BinanceService {
  private client: BinanceClient;

  constructor() {
    this.client = this.createClient();
  }

  protected createClient(): BinanceClient {
    return BinanceFactory();
  }

  async analyzeHistoryData(
    symbol: string,
    interval: CandleChartInterval_LT,
    startTime?: number,
    endTime?: number,
  ) {
    const data = await this.client.candles({
      symbol,
      interval,
      startTime,
      endTime,
    });
    const priceChanges = data
      .map((candle, index) => {
        if (index === 0) return { priceChange: 0, percentageChange: 0 };
        const previousClose = data[index - 1].close;
        const currentClose = candle.close;
        const priceChange = +currentClose - +previousClose;
        const percentageChange = (priceChange / +previousClose) * 100;
        return {
          timestamp: candle.openTime,
          priceChange,
          percentageChange,
        };
      })
      .slice(1);
    return {
      symbol,
      interval,
      priceChanges,
    };
  }
}
