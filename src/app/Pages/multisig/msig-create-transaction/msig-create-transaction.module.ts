import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/Components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book-list/address-book.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';


import { MsigCreateTransactionPage } from './msig-create-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: MsigCreateTransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AddressBookComponentModule
  ],
  entryComponents: [CurrencyComponent],
  declarations: [MsigCreateTransactionPage]
})
export class MsigCreateTransactionPageModule {}
