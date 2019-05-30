import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Bip39 from 'bip39';
import { wordlist } from '../../assets/js/wordlist'; 

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const EDDSA = require('elliptic').eddsa;
const eddsa = new EDDSA('ed25519');

import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;


  constructor(private barcodeScanner: BarcodeScanner) {
    this.encodeData = 'yuhjKhgjhgdOp786579954jhfjkhkk';

    // Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        alert('Barcode data ' + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  encodedText() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log('Error occured : ' + err);
        }
      );
  }

  showAlert() {


    // Generate a new key pair and convert them to hex-strings
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');

    var myString = "https://www.titanesmedellin.com/";
    var myPassword = "myPassword";


    // PROCESS
    var encrypted = CryptoJS.AES.encrypt(myString, myPassword);
    var decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);


    var crypto = window.crypto;
    var passPhrase = "";

    

    if (crypto) {
      var bits = 128;
      var random = new Uint32Array(bits / 32);
      crypto.getRandomValues(random);
      var n = wordlist.length;
      var phraseWords = [];
      var x, w1, w2, w3;
      for (var i = 0; i < random.length; i++) {
        x = random[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;

        phraseWords.push(wordlist[w1]);
        phraseWords.push(wordlist[w2]);
        phraseWords.push(wordlist[w3]);
      }

      passPhrase = phraseWords.join(" ");
      crypto.getRandomValues(random);
    }

    
    let kp = eddsa.keyFromSecret(passPhrase);
    let pubKey = kp.getPublic('hex');
    //let priKey = kp.getPrivate('hex');

    alert(pubKey);
  }
  
  calculateHash(){    
    return SHA256("Dari Putu" + "Ke Eka" + 120000).toString();
  }

  genKeyPair(secret) {
    return eddsa.keyFromSecret(secret);
  }

}
