import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TransactionPage } from "./transaction.page";
import { ZoobcPipesModule } from "src/app/Pipes/zoobc-pipes.module";

const routes: Routes = [
  {
    path: "",
    component: TransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ZoobcPipesModule
  ],
  declarations: [TransactionPage]
})
export class TransactionPageModule {}
