import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss'],
})
export class SetupPinPage implements OnInit {

  constructor(
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  savePin() {
    this.storage.set("test", "value")
  }

}
