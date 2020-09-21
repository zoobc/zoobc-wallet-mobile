import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookPage } from './address-book.page';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book-list/address-book.module';
import { AddAddressPage } from './add-address/add-address.page';
import { FormAddressComponent } from './form-address/form-address.component';
import { EditAddressPage } from './edit-address/edit-address.page';
import { SharedModule } from 'src/app/Shared/shared.module';
import { PopoverAddressComponent } from './popover-address/popover-address.component';

const routes: Routes = [
  {
    path: '',
    component: AddressBookPage
  },
  {
    path: 'add',
    component: AddAddressPage
  },
  {
    path: 'export-import',
    loadChildren: './export-import/export-import.module#ExportImportPageModule'
  },
  {
    path: ':addressId',
    component: EditAddressPage
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
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    AddressBookPage,
    AddAddressPage,
    EditAddressPage,
    FormAddressComponent,
    PopoverAddressComponent
  ],
  entryComponents: [
    PopoverAddressComponent
  ]
})
export class AddressBookPageModule { }
