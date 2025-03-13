import { Test, TestingModule } from '@nestjs/testing';
import { BinanceService } from './binance.service';

jest.mock('binance-api-node', () => {
  const mockCandles = jest.fn();
  const mockBinance = jest.fn().mockImplementation(() => ({
    candles: mockCandles,
  }));

  return {
    __esModule: true,
    default: mockBinance,
  };
});

describe('BinanceService', () => {
  let service: BinanceService;
  let mockCandles: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceService],
    }).compile();

    service = module.get<BinanceService>(BinanceService);

    const binanceModule = jest.requireMock('binance-api-node');
    const binanceClient = binanceModule.default();
    mockCandles = binanceClient.candles;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchHistoryData', () => {
    it('should fetch and analyze historical data successfully', async () => {
      const mockCandleData = [
        {
          openTime: 1625097600000,
          open: '35000',
          high: '36000',
          low: '34500',
          close: '35500',
          volume: '100',
          closeTime: 1625184000000,
          quoteAssetVolume: '3517500',
          trades: 1000,
          baseAssetVolume: '50.25',
          quoteVolume: '1758750',
        },
        {
          openTime: 1625184000000,
          open: '35500',
          high: '37000',
          low: '35000',
          close: '36500',
          volume: '120',
          closeTime: 1625270400000,
          quoteAssetVolume: '4392500',
          trades: 1200,
          baseAssetVolume: '60.25',
          quoteVolume: '2196250',
        },
        {
          openTime: 1625270400000,
          open: '36500',
          high: '38000',
          low: '36000',
          close: '37500',
          volume: '150',
          closeTime: 1625356800000,
          quoteAssetVolume: '5625000',
          trades: 1500,
          baseAssetVolume: '75.25',
          quoteVolume: '2812500',
        },
      ];

      mockCandles.mockResolvedValue(mockCandleData);

      const result = await service.analyzeHistoryData(
        'BTCUSDT',
        '1d',
        1625097600000,
        1625356800000,
      );

      expect(mockCandles).toHaveBeenCalledWith({
        symbol: 'BTCUSDT',
        interval: '1d',
        startTime: 1625097600000,
        endTime: 1625356800000,
      });

      expect(result).toEqual({
        symbol: 'BTCUSDT',
        interval: '1d',
        priceChanges: [
          {
            timestamp: 1625184000000,
            priceChange: 1000,
            percentageChange: expect.any(Number),
          },
          {
            timestamp: 1625270400000,
            priceChange: 1000,
            percentageChange: expect.any(Number),
          },
        ],
      });

      expect(result.priceChanges[0].priceChange).toBe(36500 - 35500);
      expect(result.priceChanges[1].priceChange).toBe(37500 - 36500);

      expect(result.priceChanges[0].percentageChange).toBeCloseTo(2.82, 2);
      expect(result.priceChanges[1].percentageChange).toBeCloseTo(2.74, 2);
    });

    it('should handle empty candle data', async () => {
      mockCandles.mockResolvedValue([]);
      const result = await service.analyzeHistoryData('BTCUSDT', '1d');

      expect(result).toEqual({
        symbol: 'BTCUSDT',
        interval: '1d',
        priceChanges: [],
      });
    });

    it('should handle single candle data', async () => {
      const singleCandleData = [
        {
          openTime: 1625097600000,
          open: '35000',
          high: '36000',
          low: '34500',
          close: '35500',
          volume: '100',
          closeTime: 1625184000000,
          quoteAssetVolume: '3517500',
          trades: 1000,
          baseAssetVolume: '50.25',
          quoteVolume: '1758750',
        },
      ];

      mockCandles.mockResolvedValue(singleCandleData);

      const result = await service.analyzeHistoryData('BTCUSDT', '1d');

      expect(result).toEqual({
        symbol: 'BTCUSDT',
        interval: '1d',
        priceChanges: [],
      });
    });

    it('should handle API errors', async () => {
      const apiError = new Error('API request failed');
      mockCandles.mockRejectedValue(apiError);

      await expect(service.analyzeHistoryData('BTCUSDT', '1d')).rejects.toThrow(
        'API request failed',
      );
    });

    it('should handle invalid symbol', async () => {
      const apiError = new Error('Invalid symbol');
      mockCandles.mockRejectedValue(apiError);

      await expect(service.analyzeHistoryData('INVALID', '1d')).rejects.toThrow(
        'Invalid symbol',
      );
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      mockCandles.mockRejectedValue(rateLimitError);

      await expect(service.analyzeHistoryData('BTCUSDT', '1d')).rejects.toThrow(
        'Rate limit exceeded',
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockCandles.mockRejectedValue(networkError);

      await expect(service.analyzeHistoryData('BTCUSDT', '1d')).rejects.toThrow(
        'Network error',
      );
    });
  });
});
