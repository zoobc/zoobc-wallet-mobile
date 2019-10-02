import { Directive, HostListener, ElementRef } from "@angular/core";
import { ModalCurrencySelectorComponent } from "./modal-currency-selector/modal-currency-selector.component";
import { ModalController } from "@ionic/angular";

@Directive({
  selector: "[appCurrencySelector]"
})
export class CurrencySelectorDirective {
  constructor(private el: ElementRef, private modalCtrl: ModalController) {}

  @HostListener("click", ["$event"]) onClick($event) {
    this.presentModalCurrencySelection();
  }

  async presentModalCurrencySelection() {
    const modal = await this.modalCtrl.create({
      component: ModalCurrencySelectorComponent
    });
    return await modal.present();
  }
}