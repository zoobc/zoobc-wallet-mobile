import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActiveCurrencyRatePipe } from "./active-currency-rate.pipe";
import { IonicModule } from "@ionic/angular";
import { ModalCurrencySelectorComponent } from "./modal-currency-selector/modal-currency-selector.component";
import { CurrencySelectorDirective } from "./currency-selector.directive";

@NgModule({
  declarations: [
    ActiveCurrencyRatePipe,
    ActiveCurrencyRatePipe,
    ModalCurrencySelectorComponent,
    CurrencySelectorDirective
  ],
  imports: [CommonModule, IonicModule],
  exports: [ActiveCurrencyRatePipe, CurrencySelectorDirective],
  entryComponents: [ModalCurrencySelectorComponent]
})
export class CurrencySelectionModule {}
