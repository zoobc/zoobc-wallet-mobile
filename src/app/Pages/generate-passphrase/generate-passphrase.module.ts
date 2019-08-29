import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { GeneratePassphrasePage } from "./generate-passphrase.page";
import { CreateNewStepsComponent } from "../../Components/create-new-steps/create-new-steps.component";

const routes: Routes = [
  {
    path: "",
    component: GeneratePassphrasePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GeneratePassphrasePage, CreateNewStepsComponent]
})
export class GeneratePassphrasePageModule {}
