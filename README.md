
# ZooBC Mobile Wallet   
ZooBC wallet is a mobile application that is able to connect with the ZooBC blockchain network, so it can carry out activities such as creating accounts, viewing balances, sending coins, displaying QRcode addresses.  
   
## Frameworks
  - Ionic Framework v4
  - Angluar 7
  - Android SDK (for Android)
  - XCode (for iOs)

## Features!
- Create wallet
- Restore wallet
- Create account
- Account Balance
- Send Coin
- Send Coin with escrow
- Receive Coin 
- Transaction history
- My Task
- Cool apps
- Scan Barcode
- Blog
- Chat
- Multi Language i18n
- Multi Currency


## Installation
```sh
$ git clone https://github.com/zoobc/zoobc-wallet-mobile.git
$ cd zoobc-wallet-mobile
$ npm i
$ ionic serve
```

## Plugins

```sh
npm install --save @ngx-translate/core
npm install @ngx-translate/http-loader --save

ionic cordova plugin add cordova-clipboard
npm install @ionic-native/clipboard

ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage

ionic cordova plugin add cordova-plugin-network-information
npm install @ionic-native/network

ionic cordova plugin add cordova-plugin-file
npm install @ionic-native/file

ionic cordova plugin add phonegap-plugin-barcodescanner
npm install @ionic-native/barcode-scanner

ionic cordova plugin add cordova-plugin-globalization
npm install @ionic-native/globalization

ionic cordova plugin add cordova-plugin-x-socialsharing
npm install @ionic-native/social-sharing

npm install ngx-qrcode2 --save

npm install base58-encode

npm i -D @angular-builders/custom-webpack

npm i @ngxs/store
```