import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TabDashboardPage } from "./tab-dashboard.page";
import { TranslateModule } from "@ngx-translate/core";
import { Network } from "@ionic-native/network/ngx";
import { SidemenuModule } from "src/app/Shared/sidemenu/sidemenu.module";
import { CalendarDateModule } from "src/app/Shared/calendar-date/calendar-date.module";
import { CurrencySelectionModule } from "src/app/Shared/currency-selection/currency-selection.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabDashboardPage }]),
    SidemenuModule,
    CalendarDateModule,
    CurrencySelectionModule
  ],
  declarations: [TabDashboardPage],
  entryComponents: [],
  providers: [Network]
})
export class TabDashboardPageModule {}
