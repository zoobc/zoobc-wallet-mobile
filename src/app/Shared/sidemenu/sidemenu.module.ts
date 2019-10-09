import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SidemenuComponent } from "./sidemenu.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule.forRoot(), TranslateModule],
  declarations: [SidemenuComponent],
  exports: [SidemenuComponent]
})
export class SidemenuModule {}
