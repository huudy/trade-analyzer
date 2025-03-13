import { Controller, Get, Query } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ValidateInterval } from 'src/decorators/validate-interval.decorator';
import { CandleChartInterval_LT } from 'binance-api-node';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('historical-data')
  async fetchHistoryData(
    @Query('symbol') symbol: string,
    @ValidateInterval('interval') interval: CandleChartInterval_LT,
  ) {
    return this.binanceService.fetchHistoryData(symbol, interval);
  }
}
