import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountComponent } from "./account.component";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalFormAccountComponent } from "./modal-form-account/modal-form-account.component";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { CurrencySelectionModule } from "src/app/Shared/currency-selection/currency-selection.module";

const routes: Routes = [
  {
    path: "",
    component: AccountComponent
  }
];

@NgModule({
  declarations: [AccountComponent, ModalFormAccountComponent],
  entryComponents: [ModalFormAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CurrencySelectionModule
  ],
  providers: [SocialSharing]
})
export class AccountModule {}
