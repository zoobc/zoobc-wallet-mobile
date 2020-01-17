import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AppsPage } from "./apps.page";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: AppsPage
  },
  {
    path: "sell",
    loadChildren: "./sell/sell.module#AppSellPageModule"
  }
];

@NgModule({
  declarations: [AppsPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class AppsPageModule {}
