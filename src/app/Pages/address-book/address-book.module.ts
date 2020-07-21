import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookPage } from './address-book.page';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book-list/address-book.module';
import { AuthService } from 'src/app/Services/auth-service';
import { AddAddressPage } from './add-address/add-address.page';
import { FormAddressComponent } from './form-address/form-address.component';
import { EditAddressPage } from './edit-address/edit-address.page';

const routes: Routes = [
  {
    path: '',
    component: AddressBookPage
  },
  {
    path: 'add',
    component: AddAddressPage,
    canActivate: [AuthService]
  },
  {
    path: ':addressId',
    component: EditAddressPage,
    canActivate: [AuthService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AddressBookComponentModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddressBookPage,
    AddAddressPage,
    EditAddressPage,
    FormAddressComponent
  ]
})
export class AddressBookPageModule {}
