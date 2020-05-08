import { Component, OnInit, HostListener } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CurrencyService } from 'src/app/Services/currency.service';

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
  currencyRate: any;
  priceInUSD: any;
  isAdvance: boolean;
  escrowApprover: string;
  escrowCommision: number;
  escrowTimout: number;
  escrowInstruction: string;
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
    this.trxFee = this.navParams.data.trxFee;
    this.trxAmount = this.navParams.data.trxAmount;
    this.trxBalance = this.navParams.data.trxBalance;
    this.trxSender = this.navParams.data.trxSender;
    this.trxRecipient = this.navParams.data.trxRecipient;
    this.currencyRate = this.navParams.data.trxCurrencyRate;
    this.priceInUSD = this.currencyServ.getPriceInUSD();
    this.isAdvance = this.navParams.data.IsEscrow;
    this.escrowApprover = this.navParams.data.escApproverAddress;
    this.escrowCommision = this.navParams.data.escCommission;
    this.escrowTimout = this.navParams.data.escTimeout;
    this.escrowInstruction = this.navParams.data.escInstruction;
  }

  async cancel() {
    await this.modalController.dismiss(0);
  }


  async confirm() {
    await this.modalController.dismiss(1);
  }

}
