import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CurrencyService } from "src/app/Services/currency.service";

@Component({
  selector: "app-modal-currency-selector",
  templateUrl: "./modal-currency-selector.component.html",
  styleUrls: ["./modal-currency-selector.component.scss"]
})
export class ModalCurrencySelectorComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private currencySrv: CurrencyService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  selectCurrency(currency: string) {
    this.currencySrv.setActiveCurrency(currency);
    this.modalCtrl.dismiss();
  }
}
