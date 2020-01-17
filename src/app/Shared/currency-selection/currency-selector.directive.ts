import { Directive, HostListener, ElementRef } from "@angular/core";
import { ModalCurrencySelectorComponent } from "./modal-currency-selector/modal-currency-selector.component";
import { ModalController } from "@ionic/angular";

@Directive({
  selector: "[appCurrencySelector]"
})
export class CurrencySelectorDirective {
  constructor(private modalCtrl: ModalController) {}

  @HostListener("click", ["$event"]) onClick($event) {
    this.presentModalCurrencySelection();
  }

  async presentModalCurrencySelection() {
    const modal = await this.modalCtrl.create({
      component: ModalCurrencySelectorComponent,
      cssClass: "modal-currency-selector"
    });
    return await modal.present();
  }
}
