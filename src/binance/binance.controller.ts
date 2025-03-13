import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { BinanceService } from './binance.service';
import {
  ApiIntervalQuery,
  ValidateInterval,
} from 'src/decorators/validate-interval.decorator';
import { CandleChartInterval_LT } from 'binance-api-node';

@ApiTags('Binance API')
@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('historical-data')
  @ApiIntervalQuery()
  @ApiOperation({
    summary: 'Fetch historical data from Binance',
    description:
      'Retrieves historical candlestick data for a specified symbol and interval.',
  })
  @ApiQuery({
    name: 'symbol',
    description: 'Trading symbol (e.g., BTCUSDT)',
    required: true,
    example: 'BTCUSDT',
  })
  @ApiQuery({
    name: 'interval',
    description:
      'Candlestick interval (e.g., 1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)',
    required: true,
    example: '1m',
  })
  @ApiQuery({
    name: 'startTime',
    description:
      'Optional start time in milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC)',
    required: false,
    example: 1643723400000,
  })
  @ApiQuery({
    name: 'endTime',
    description:
      'Optional end time in milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC)',
    required: false,
    example: 1643723400000,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns historical data',
    type: 'array',
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters or interval',
  })
  async fetchHistoryData(
    @Query('symbol') symbol: string,
    @ValidateInterval() interval: CandleChartInterval_LT,
    @Query('startTime') startTime?: number,
    @Query('endTime') endTime?: number,
  ) {
    return this.binanceService.fetchHistoryData(
      symbol,
      interval,
      startTime,
      endTime,
    );
  }
}
