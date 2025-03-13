import { Test, TestingModule } from '@nestjs/testing';
import { BinanceController } from './binance.controller';
import { BinanceService } from './binance.service';
import Binance, { Binance as BinanceClient } from 'binance-api-node';
import {
  ApiIntervalQuery,
  ValidateInterval,
} from '../decorators/validate-interval.decorator';
import { CandleChartInterval_LT } from 'binance-api-node';

describe('BinanceController', () => {
  interface MockBinanceService {
    analyzeHistoryData: jest.Mock;
  }

  let controller: BinanceController;
  let mockBinanceService: MockBinanceService;

  beforeEach(async () => {
    mockBinanceService = {
      analyzeHistoryData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinanceController],
      providers: [
        {
          provide: BinanceService,
          useValue: mockBinanceService,
        },
      ],
    }).compile();

    controller = module.get<BinanceController>(BinanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch historical data successfully', async () => {
    mockBinanceService.analyzeHistoryData.mockResolvedValue({
      symbol: 'BTCUSDT',
      interval: '1m',
      priceChanges: [
        { timestamp: 1643723400000, priceChange: 50, percentageChange: 0.1 },
      ],
    });

    const result = await controller.analyzeHistoryData(
      'BTCUSDT',
      '1m',
      1643723400000,
      1643723460000,
    );

    expect(result).toEqual({
      symbol: 'BTCUSDT',
      interval: '1m',
      priceChanges: [
        { timestamp: 1643723400000, priceChange: 50, percentageChange: 0.1 },
      ],
    });
  });

  it('should handle Binance API errors gracefully', async () => {
    mockBinanceService.analyzeHistoryData.mockRejectedValue(
      new Error('Binance API error'),
    );

    await expect(
      controller.analyzeHistoryData(
        'BTCUSDT',
        '1m',
        1643723400000,
        1643723460000,
      ),
    ).rejects.toThrow('Binance API error');
  });

  it('should handle invalid symbol', async () => {
    mockBinanceService.analyzeHistoryData.mockRejectedValue(
      new Error('Invalid symbol'),
    );

    await expect(
      controller.analyzeHistoryData(
        'INVALIDSYMBOL',
        '1m',
        1643723400000,
        1643723460000,
      ),
    ).rejects.toThrow('Invalid symbol');
  });

  it('should handle invalid interval', async () => {
    mockBinanceService.analyzeHistoryData.mockRejectedValue(
      new Error('Invalid interval'),
    );

    await expect(
      controller.analyzeHistoryData(
        'BTCUSDT',
        'INVALIDINTERVAL' as CandleChartInterval_LT,
        1643723400000,
        1643723460000,
      ),
    ).rejects.toThrow('Invalid interval');
  });

  it('should handle network errors', async () => {
    mockBinanceService.analyzeHistoryData.mockRejectedValue(
      new Error('Network error'),
    );

    await expect(
      controller.analyzeHistoryData(
        'BTCUSDT',
        '1m',
        1643723400000,
        1643723460000,
      ),
    ).rejects.toThrow('Network error');
  });
});
