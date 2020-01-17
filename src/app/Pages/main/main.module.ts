import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MainPageRoutingModule } from "./main.router.module";

import { MainPage } from "./main.page";
import { TranslateModule } from "@ngx-translate/core";
import { SidemenuModule } from "src/app/Shared/sidemenu/sidemenu.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MainPageRoutingModule,
    TranslateModule,
    SidemenuModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
