import { Component, OnInit } from '@angular/core';
import { wordlist } from '../../assets/js/wordlist';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  mnemonicData: any;
  pashprase: any;

  constructor() { }


  ionViewWillEnter() {
    const crypto = window.crypto;
    if (crypto) {
      const bits = 128;
      const random = new Uint32Array(bits / 32);
      crypto.getRandomValues(random);
      const n = wordlist.length;
      const phraseWords = [];
      let x, w1, w2, w3;
      for (let i = 0; i < random.length; i++) {
        x = random[i];
        w1 = x % n;
        w2 = (((x / n) >> 0) + w1) % n;
        w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
        phraseWords.push(wordlist[w1]);
        phraseWords.push(wordlist[w2]);
        phraseWords.push(wordlist[w3]);
        this.pashprase = phraseWords.join(' ');
      }
    }
  }

  ionViewDidEnter (){
  }

  ngOnInit() {
  }

}
