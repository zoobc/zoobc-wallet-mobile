import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TestWPage } from "./test-w.page";
import { SidemenuModule } from "src/app/Components/sidemenu/sidemenu.module";

const routes: Routes = [
  {
    path: "",
    component: TestWPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SidemenuModule
  ],
  declarations: [TestWPage]
})
export class TestWPageModule {}
