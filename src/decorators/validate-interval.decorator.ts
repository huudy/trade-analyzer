import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CandleChartInterval } from 'binance-api-node';

export const ValidateInterval = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CandleChartInterval => {
    const request = ctx.switchToHttp().getRequest();
    const interval: string = request.query.interval;

    const validIntervals: string[] = [
      '1m',
      '3m',
      '5m',
      '15m',
      '30m',
      '1h',
      '2h',
      '4h',
      '6h',
      '8h',
      '12h',
      '1d',
      '3d',
      '1w',
      '1M',
    ];

    if (!validIntervals.includes(interval)) {
      throw new BadRequestException(
        `Invalid interval '${interval}'. Allowed values are: ${validIntervals.join(', ')}`,
      );
    }

    return interval as CandleChartInterval;
  },
);

export const ApiIntervalQuery = () =>
  ApiQuery({
    name: 'interval',
    enum: [
      '1m',
      '3m',
      '5m',
      '15m',
      '30m',
      '1h',
      '2h',
      '4h',
      '6h',
      '8h',
      '12h',
      '1d',
      '3d',
      '1w',
      '1M',
    ],
    required: true,
    description: 'Candle chart interval (e.g., 1m, 5m, 1h)',
    example: CandleChartInterval.ONE_HOUR,
  });
