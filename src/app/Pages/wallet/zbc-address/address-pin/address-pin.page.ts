import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-address-pin',
  templateUrl: './address-pin.page.html',
  styleUrls: ['./address-pin.page.scss'],
})
export class AddressPinPage implements OnInit {


  private tempPin: string;
  public pagePosition: number;
  public passphrase: string;
  public processing = false;
  public loginFail = false;

  constructor(
    private modalCtrl: ModalController  ) {
  }

  ngOnInit() {
    this.pagePosition = 0;
    this.processing = false;
    this.tempPin = '';
  }

  setupPin(event: any) {
    this.loginFail = false;
    this.tempPin = event.pin;
    this.processing = true;
    setTimeout(() => {
      this.pagePosition++;
      this.processing = false;
    }, 1500);
  }

  async confirmPin(event: any) {
    const { pin } = event;
    this.loginFail = false;
    this.processing = true;
    if (this.tempPin === pin) {
      this.modalCtrl.dismiss(pin);
      setTimeout(() => {
        this.processing = false;
      }, 5000);
    } else {
      this.loginFail = true;
      setTimeout(() => {
        this.loginFail = false;
        this.processing = false;
      }, 1500);
    }
  }

  async cancel() {
    await this.modalCtrl.dismiss('-');
  }

}
