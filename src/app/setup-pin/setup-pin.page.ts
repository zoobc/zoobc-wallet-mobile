import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import sha512 from 'crypto-js/sha512';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss'],
})
export class SetupPinPage implements OnInit {
  private pin: number

  constructor(
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {}

  async savePin() {
    const encryptedPin = sha512(this.pin.toString()).toString()
    this.storage.set("pin", encryptedPin)
    this.router.navigate(['login'])
  }
}
