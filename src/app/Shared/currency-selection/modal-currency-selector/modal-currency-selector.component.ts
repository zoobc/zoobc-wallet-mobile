import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CurrencyService } from "src/app/Services/currency.service";

@Component({
  selector: "app-modal-currency-selector",
  templateUrl: "./modal-currency-selector.component.html",
  styleUrls: ["./modal-currency-selector.component.scss"]
})
export class ModalCurrencySelectorComponent implements OnInit {
  activeCurrency = null;

  constructor(
    private modalCtrl: ModalController,
    private currencySrv: CurrencyService
  ) {}

  ngOnInit() {
    this.activeCurrency = this.currencySrv.activeCurrency;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  selectCurrency(currency: string) {
    this.currencySrv.activeCurrency = currency;
    this.modalCtrl.dismiss();
  }
}
