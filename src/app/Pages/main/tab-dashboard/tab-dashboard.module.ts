import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TabDashboardPage } from "./tab-dashboard.page";
import { TranslateModule } from "@ngx-translate/core";
import { Network } from "@ionic-native/network/ngx";
import { PipeModule } from "src/pipe/pipe.module";
import { SidemenuModule } from "src/app/Components/sidemenu/sidemenu.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabDashboardPage }]),
    PipeModule,
    SidemenuModule
  ],
  declarations: [TabDashboardPage],
  entryComponents: [],
  providers: [Network]
})
export class TabDashboardPageModule {}
