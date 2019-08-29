import { NgModule } from "@angular/core";
import { PinComponent } from "./pin.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule.forRoot(), TranslateModule],
  declarations: [PinComponent],
  exports: [PinComponent]
})
export class PinModule {}
