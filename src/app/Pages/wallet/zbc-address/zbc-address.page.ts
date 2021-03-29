import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Account } from 'src/app/Interfaces/account';
import { AccountService } from 'src/app/Services/account.service';
import { AuthService } from 'src/app/Services/auth-service';
import { UtilService } from 'src/app/Services/util.service';
import { PkeyPinPage } from '../private-key/pkey-pin/pkey-pin.page';
import { AddressPinPage } from './address-pin/address-pin.page';

@Component({
  selector: 'app-zbc-address',
  templateUrl: './zbc-address.page.html',
  styleUrls: ['./zbc-address.page.scss'],
})
export class ZbcAddressPage implements OnInit {

  form: FormGroup;
  addressField = new FormControl('', Validators.required);
  zbcAddress: string;
  plainPin: string;
  isProcessing = false;
  constructor(
    private authServ: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private accServ: AccountService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private utilSrv: UtilService
  ) {
    this.form = new FormGroup({
      address: this.addressField,
    });
  }

  ngOnInit(): void {
    this.isProcessing = false;
  }

  onLogin() {
    if (this.form.valid) {
      this.zbcAddress = this.addressField.value;

      if (!this.zbcAddress.startsWith('ZBC_') || this.zbcAddress.length < 66) {
        this.utilSrv.showAlert('Error', 'Address is not valid!', 'ZBC address start with ZBC_ and the length is 66!');
        return;
      }
      this.isProcessing = true;
      this.accServ.setZbcAddress(this.zbcAddress);
      this.showPinDialog();
    } else {
      this.isProcessing = false;
      this.addressField.markAsTouched();
    }
  }


  async showPinDialog() {
    const pinmodal = await this.modalController.create({
      component: AddressPinPage,
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
    await this.accServ.createAccountWithAddress();
    const loginStatus = this.authServ.loginWithAddress(this.plainPin);
    if (loginStatus) {
      this.navCtrl.navigateRoot('/tabs/home');
    }
  }

}
