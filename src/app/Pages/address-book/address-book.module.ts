import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookPage } from "./address-book.page";
import { AddressBookComponentModule } from "src/app/Components/address-book/address-book-list/address-book.module";

const routes: Routes = [
  {
    path: "",
    component: AddressBookPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AddressBookComponentModule
  ],
  declarations: [AddressBookPage]
})
export class AddressBookPageModule {}
