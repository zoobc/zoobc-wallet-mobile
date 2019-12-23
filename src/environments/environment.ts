// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultCurrency: 'USD',
  // grpcUrl: 'http://18.139.3.139:5001',
  grpcUrl: '//172.104.47.168:8001',
  feedbackUrl: 'https://doorbell.io/api',
  currencyRateUrl: 'https://api.exchangeratesapi.io/latest?base=USD',
  openExchangeUrl: 'https://openexchangerates.org/api',
  mnemonicLanguage: 'english',
  mnemonicNumWords: 24,
  signalID: '790fe50a-589d-40c7-92af-683582d40acf',
  appID: '482874041634',
  zbcPriceInUSD: 10,
  saltForAccount: 'p4ssphr4se'

};

