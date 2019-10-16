import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormFeeComponent } from "./form-fee.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [FormFeeComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [FormFeeComponent]
})
export class FormFeeModule {}
