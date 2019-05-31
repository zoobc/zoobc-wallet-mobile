import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss'],
})
export class SetupPinPage implements OnInit {
  pin: number

  constructor(
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  async savePin() {
    const encryptedPin = sha256(this.pin).toString();
    this.storage.set("pin", encryptedPin)
    const a = await this.storage.get("pin")
  }

}
