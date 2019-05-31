import { Component, OnInit } from '@angular/core';
import * as qrcode from 'qrcode-generator';

/*
import * as CryptoJS from 'crypto-js';
import * as Bip39 from 'bip39';
import { wordlist } from '../../assets/js/wordlist'; 

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const EDDSA = require('elliptic').eddsa;
const eddsa = new EDDSA('ed25519');
*/

import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit{
  address: any;
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  qrElement: any;
  address2 = 'dfsfsdfsfsdfsdfsdKKKK';

  constructor(private barcodeScanner: BarcodeScanner) {
    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  createQR() {
    const qr = qrcode(8, 'L');
    qr.addData('1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX');
    qr.make();
    this.qrElement = qr.createImgTag();
  }

  encodedText() {
    this.encodeData = '1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX';
    alert(this.encodeData);

    // this.barcodeScanner
    //   .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
    //   .then(
    //     encodedData => {
    //       console.log(encodedData);
    //       this.encodeData = encodedData;
    //     },
    //     err => {
    //       console.log('Error occured : ' + err);
    //     }
    //   );
  }

  
  getAddress(){
    this.encodeData =  JSON.stringify('1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX');
  }
  
  ngOnInit() {
    this.getAddress();
    this.createQR();
  }

  // showAlert() {


  //   // Generate a new key pair and convert them to hex-strings
  //   const key = ec.genKeyPair();
  //   const publicKey = key.getPublic('hex');
  //   const privateKey = key.getPrivate('hex');

  //   var myString = "https://www.titanesmedellin.com/";
  //   var myPassword = "myPassword";


  //   // PROCESS
  //   var encrypted = CryptoJS.AES.encrypt(myString, myPassword);
  //   var decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);

  //   var crypto = window.crypto;
  //   var passPhrase = "";

  //   if (crypto) {
  //     var bits = 128;
  //     var random = new Uint32Array(bits / 32);
  //     crypto.getRandomValues(random);
  //     var n = wordlist.length;
  //     var phraseWords = [];
  //     var x, w1, w2, w3;
  //     for (var i = 0; i < random.length; i++) {
  //       x = random[i];
  //       w1 = x % n;
  //       w2 = (((x / n) >> 0) + w1) % n;
  //       w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;

  //       phraseWords.push(wordlist[w1]);
  //       phraseWords.push(wordlist[w2]);
  //       phraseWords.push(wordlist[w3]);
  //     }

  //     passPhrase = phraseWords.join(" ");
  //     crypto.getRandomValues(random);
  //   }

  //   let kp = eddsa.keyFromSecret(passPhrase);
  //   let pubKey = kp.getPublic('hex');

  // }

}
