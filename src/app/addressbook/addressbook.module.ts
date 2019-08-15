import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AddressbookPage } from "./addressbook.page";
import { ModalAddressbookComponent } from "./modal-addressbook/modal-addressbook.component";

const routes: Routes = [
  {
    path: "",
    component: AddressbookPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressbookPage, ModalAddressbookComponent],
  entryComponents: [ModalAddressbookComponent]
})
export class AddressbookPageModule {}
