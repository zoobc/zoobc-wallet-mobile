import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { AddressBookListComponent } from "./address-book-list/address-book-list.component";
import { AddressBookFormComponent } from "./address-book-form/address-book-form.component";

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [AddressBookListComponent, AddressBookFormComponent],
  exports: [AddressBookListComponent],
  entryComponents: [AddressBookFormComponent]
})
export class AddressBookComponentModule {}
