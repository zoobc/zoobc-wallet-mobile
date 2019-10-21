import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookListComponent } from './address-book-list/address-book-list.component';
import { from } from 'rxjs';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  declarations: [AddressBookListComponent],
  exports: [AddressBookListComponent]
})
export class AddressBookComponentModule { }
