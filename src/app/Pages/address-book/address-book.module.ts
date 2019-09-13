import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AddressBookPage } from "./address-book.page";
import { AddressBookFormComponent } from "./address-book-form/address-book-form.component";

const routes: Routes = [
  {
    path: "",
    component: AddressBookPage
  },
  {
    path: "add",
    component: AddressBookFormComponent,
    data: {
      title: "Add New Address"
    }
  },
  {
    path: ":id",
    component: AddressBookFormComponent,
    data: {
      title: "Edit Address"
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressBookPage, AddressBookFormComponent]
})
export class AddressBookPageModule {}
