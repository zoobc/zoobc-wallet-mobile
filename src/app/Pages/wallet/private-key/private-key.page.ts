import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth-service';
import { AccountService } from 'src/app/Services/account.service';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { PkeyPinPage } from './pkey-pin/pkey-pin.page';

@Component({
  selector: 'app-private-key',
  templateUrl: './private-key.page.html',
  styleUrls: ['./private-key.page.scss'],
})
export class PrivateKeyPage implements OnInit {

  form: FormGroup;
  privKeyField = new FormControl('', Validators.required);
  hexPriv: string;
  plainPin: string;
  isProcessing = false;

  constructor(
    public loadingController: LoadingController,
    private authServ: AuthService,
    private accServ: AccountService,
    private modalController: ModalController,
    private navCtrl: NavController  ) {
    this.form = new FormGroup({
      privateKey: this.privKeyField,
    });
  }


  ngOnInit(): void {
    this.isProcessing = false;
  }

  async onLogin() {
    if (this.form.valid) {
      this.hexPriv = this.privKeyField.value;
      this.accServ.setPlainPk(this.hexPriv);
      this.isProcessing = true;
      this.showPinDialog();
    } else {
      this.isProcessing = false;
      this.privKeyField.markAsTouched();
    }
  }

  async showPinDialog() {
    const pinmodal = await this.modalController.create({
      component: PkeyPinPage,
      cssClass: 'modal-zbc',
      componentProps: {
      }
    });

    pinmodal.onDidDismiss().then(returnedData => {
      if (returnedData && returnedData.data !== '-') {
        this.plainPin = returnedData.data;
        this.accServ.setPlainPin(this.plainPin);
        this.createAccount();
      } else {
        this.isProcessing = false;
      }
    });
    return await pinmodal.present();
  }

  async createAccount() {
    await this.accServ.createAccountWithPK();
    const loginStatus = this.authServ.loginWithPK(this.plainPin);
    if (loginStatus) {
      this.navCtrl.navigateRoot('/tabs/home');
    } else {
      this.isProcessing = false;
    }
  }

}
