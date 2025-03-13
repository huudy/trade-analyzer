## Description

This nest.js application fetches and analyzes historical market data from the Binance cryptocurrency exchange. It provides an API endpoint to retrieve and analyze data for a specific cryptocurrency symbol over a specified time period.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

The application will be available at `http://localhost:3000` by default.

## API Documentation
API documentation is available via Swagger at `http://localhost:3000/api`. The API includes an endpoint for fetching and analyzing historical data:

### Binance Historical Data Endpoint
- **Path:** `/binance/historical-data`
- **Method:** `GET`
- **Query Parameters:**
  - `symbol`: Trading symbol (e.g., BTCUSDT)
  - `interval`: Candlestick interval (e.g., 1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
  - `startTime`: Optional start time in milliseconds since the Unix epoch
  - `endTime`: Optional end time in milliseconds since the Unix epoch

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov