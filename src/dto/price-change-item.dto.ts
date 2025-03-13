import { ApiProperty } from '@nestjs/swagger';

export class PriceChangeItemDto {
  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  priceChange: number;

  @ApiProperty()
  percentageChange: number;
}
