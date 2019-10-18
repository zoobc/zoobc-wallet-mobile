import { Component, OnInit, HostListener } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-senddetail',
  templateUrl: './senddetail.page.html',
  styleUrls: ['./senddetail.page.scss'],
})
export class SenddetailPage implements OnInit {

  trxFee: number;
  trxAmount: number;
  trxBalance: number;
  trxSender: string;
  trxRecipient: string;
  constructor(private modalController: ModalController, private navParams: NavParams) {

  }

  @HostListener('document:ionBackButton', ['$event'])
  private async overrideHardwareBackAction($event: any) {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    console.table(this.navParams);
    this.trxFee = this.navParams.data.trxFee;
    this.trxAmount = this.navParams.data.trxAmount;
    this.trxBalance = this.navParams.data.trxBalance;
    this.trxSender = this.navParams.data.trxSender;
    this.trxRecipient = this.navParams.data.trxRecipient;
  }

  async cancel() {
    await this.modalController.dismiss(0);
  }


  async confirm() {
    await this.modalController.dismiss(1);
  }

}
