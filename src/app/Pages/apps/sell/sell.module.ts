import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppSellPage } from "./sell.page";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: AppSellPage
  }
];

@NgModule({
  declarations: [AppSellPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class AppSellPageModule {}
