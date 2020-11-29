import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TransactionDetailPage } from "./transaction-detail.page";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from 'src/app/Shared/shared.module';

const routes: Routes = [
  {
    path: "",
    component: TransactionDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule
  ],
  declarations: [TransactionDetailPage]
})
export class TransactionDetailPageModule {}
