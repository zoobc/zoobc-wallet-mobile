import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountComponent } from "./account.component";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalCreateAccountComponent } from "./modal-create-account/modal-create-account.component";

const routes: Routes = [
  {
    path: "",
    component: AccountComponent
  }
];

@NgModule({
  declarations: [AccountComponent, ModalCreateAccountComponent],
  entryComponents: [ModalCreateAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountModule {}
