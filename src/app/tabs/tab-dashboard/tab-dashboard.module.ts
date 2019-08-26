import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TabDashboardPage } from "./tab-dashboard.page";
import { ComponentsModule } from "src/components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { Network } from "@ionic-native/network/ngx";
import { PipeModule } from "src/pipe/pipe.module";
import { TransactionModule } from "src/app/Components/transaction/transaction.module";
import { TransactionDetailComponent } from "src/app/Components/transaction/transaction-detail/transaction-detail.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabDashboardPage }]),
    ComponentsModule,
    PipeModule,
    TransactionModule
  ],
  declarations: [TabDashboardPage],
  entryComponents: [TransactionDetailComponent],
  providers: [Network]
})
export class TabDashboardPageModule {}
