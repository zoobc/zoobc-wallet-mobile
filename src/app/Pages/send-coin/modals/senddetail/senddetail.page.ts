import { Component, OnInit, HostListener } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';
import { AddressBookService } from 'src/app/Services/address-book.service';

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
  trxSenderName: string;
  trxRecipient: string;
  trxRecipientName: string;
  trxCurrencyRate: any;
  priceInUSD: any;
  IsEscrow: boolean;
  escApproverAddress: string;
  escApproverName: string;
  escCommission: number;
  escTimeout: number;
  escInstruction: string;
  constructor(private modalController: ModalController,
              private currencyServ: CurrencyService,
              private navParams: NavParams) {
  }

  @HostListener('document:ionBackButton', ['$event'])
  private async overrideHardwareBackAction($event: any) {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    console.table(this.navParams);
    this.priceInUSD = this.currencyServ.getPriceInUSD();
  }


  async cancel() {
    await this.modalController.dismiss(0);
  }


  async confirm() {
    await this.modalController.dismiss(1);
  }

}
