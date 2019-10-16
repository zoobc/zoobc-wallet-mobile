import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalListAccountComponent } from "./modal-list-account/modal-list-account.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { FormSelectAccountComponent } from "./form-select-account.component";

@NgModule({
  declarations: [ModalListAccountComponent, FormSelectAccountComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  entryComponents: [ModalListAccountComponent],
  exports: [FormSelectAccountComponent]
})
export class FormSelectAccountModule {}
