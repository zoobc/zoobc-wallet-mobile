
# Frameworks
  - Ionic Framework v4
  - Angluar 7
  - Android SDK api to 29

# Features!

  - Create account
  - Wallet Balance
  - Chat
  - Address Book
  - Send Coin
  - Send coin with escrow
  - Scan Barcode
  - Receive Coin
  - Transaction History
  - Blog
  - Multi Language i18n
  - Multi Currency
  - My Task


# Plugin requireds

## Translation
npm install --save @ngx-translate/core
npm install @ngx-translate/http-loader --save


## Clipboard
ionic cordova plugin add cordova-clipboard
npm install @ionic-native/clipboard


## Storage
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage

## Network
ionic cordova plugin add cordova-plugin-network-information
npm install @ionic-native/network

## File
ionic cordova plugin add cordova-plugin-file
npm install @ionic-native/file

## Barcode Scanner
ionic cordova plugin add phonegap-plugin-barcodescanner
npm install @ionic-native/barcode-scanner

## Globalitation
ionic cordova plugin add cordova-plugin-globalization
npm install @ionic-native/globalization

## Social sharing
ionic cordova plugin add cordova-plugin-x-socialsharing
npm install @ionic-native/social-sharing

## QRCode 2
npm install ngx-qrcode2 --save


## base58
npm install base58-encode

## polyfills.ts
(window as any).global = window;

## buffer
npm install buffer
and the in polyfills.ts 
global.Buffer = global.Buffer || require('buffer').Buffer;

## Custome webpack
npm i -D @angular-builders/custom-webpack

## ngxs store
npm i @ngxs/store

## crypto-js
npm i crypto-js

#Submodule

## Add submodule:
- git submodule add -f --name  bip32 https://github.com/BlockchainZoo/bip32 externals/bip32
- git submodule add -f --name  bip39 https://github.com/iancoleman/bip39 externals/bip39

## Remove submodule:
- git submodule deinit -f externals/bip39
- rm -rf .git/modules/bip39
- git rm -f externals/bip39
