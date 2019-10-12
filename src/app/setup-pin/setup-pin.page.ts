import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth-service';
import { CreateAccountService } from '../services/create-account.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-setup-pin',
  templateUrl: './setup-pin.page.html',
  styleUrls: ['./setup-pin.page.scss']
})
export class SetupPinPage implements OnInit {
  private pin: number;
  private strTempPin: string;
  private strPin: string;
  public pageNumber: number;
  public isPinEqual: boolean;

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private createAccSrv: CreateAccountService,
    private navCtrl: NavController,
    private authSrv: AuthService
  ) {
    this.strTempPin = '';
    this.strPin = '';
    this.isPinEqual = true;
  }

  ngOnInit() {
  }

  async cancel() {
    await this.modalCtrl.dismiss(0);
  }

  ionViewWillEnter() {
    this.pageNumber = 0;
  }

  async pinConfirm(e) {
    console.log('---', e);
    const { pin, first } = e;

    if (first === true) {
      return;
    }

    this.strTempPin = pin;
    console.log('====== first PIN', this.strTempPin);
    this.pageNumber++;
  }

  async savePin(e) {
    this.isPinEqual = true;
    console.log('---', e);
    const { observer, pin, first } = e;

    if (first === true) {
      return;
    }

    this.strPin = pin;

    console.log('====== 1 first PIN', this.strTempPin);
    console.log('====== 1 confirm PIN', this.strPin);


    if (this.strPin !== this.strTempPin) {
      setTimeout(() => {
        this.isPinEqual = false;
        observer.next(true);
      }, 500);
      return;
    }

    await this.storage.set('pin', pin.toString());
    const strPIN = pin.toString();
    this.createAccSrv.setPin(strPIN);
    await this.createAccSrv.createAccount();
    const loginStatus = await this.authSrv.login(strPIN);
    if (loginStatus) {
      this.navCtrl.navigateForward('/');
      this.modalCtrl.dismiss(1);
    }
  }
}
