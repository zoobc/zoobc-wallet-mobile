// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  feedbackUrl: 'https://doorbell.io/api',
  currencyRateUrl: 'https://api.exchangeratesapi.io/latest?base=USD',
  openExchangeUrl: 'https://openexchangerates.org/api',
  mnemonicLanguage: 'english',
  mnemonicNumWords: 24,
  signalID: '9afa0071-9129-4cc2-9b03-e540943c136e',
  appID: '342522815584',
  zbcPriceInUSD: 10,
  saltForAccount: 'p4ssphr4se',
  firebaseConfig: {
    apiKey: 'AIzaSyBw44MlutdPuLOGBWm-HjrxPsn_nCux18s',
    authDomain: 'zoobcwallet.firebaseapp.com',
    databaseURL: 'https://zoobcwallet.firebaseio.com',
    projectId: 'zoobcwallet',
    storageBucket: 'zoobcwallet.appspot.com',
    messagingSenderId: '342522815584',
    appId: '1:342522815584:web:6d02dd7e49f0c72fc98f05',
    measurementId: 'G-8LG5JTR37N'
  }
};