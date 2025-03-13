import { ApiProperty } from '@nestjs/swagger';
import { PriceChangeItemDto } from './price-change-item.dto';

export class HistoricalDataResponseDto {
  @ApiProperty()
  symbol: string;

  @ApiProperty()
  interval: string;

  @ApiProperty({ type: [PriceChangeItemDto] })
  priceChanges: PriceChangeItemDto[];
}
