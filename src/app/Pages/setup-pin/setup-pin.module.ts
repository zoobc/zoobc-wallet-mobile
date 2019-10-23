import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { SetupPinPage } from "./setup-pin.page";
import { PinModule } from "src/app/Shared/pin/pin.module";

const routes: Routes = [
  {
    path: "",
    component: SetupPinPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PinModule
  ],
  declarations: [SetupPinPage]
})
export class SetupPinPageModule {}
