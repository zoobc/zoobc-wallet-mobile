import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalListAccountComponent } from "./modal-list-account/modal-list-account.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { FormSelectAccountComponent } from "./form-select-account.component";
import { CurrencySelectionModule } from "../../currency-selection/currency-selection.module";

@NgModule({
  declarations: [ModalListAccountComponent, FormSelectAccountComponent],
  imports: [CommonModule, IonicModule, FormsModule, CurrencySelectionModule],
  entryComponents: [ModalListAccountComponent],
  exports: [FormSelectAccountComponent]
})
export class FormSelectAccountModule {}
