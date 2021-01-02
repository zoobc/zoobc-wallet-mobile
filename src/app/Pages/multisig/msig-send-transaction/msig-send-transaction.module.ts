import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigSendTransactionPage } from './msig-send-transaction.page';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book-list/address-book.module';
import { ComponentsModule } from 'src/app/Components/components.module';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';

const routes: Routes = [
  {
    path: '',
    component: MsigSendTransactionPage
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
    ComponentsModule,
    RouterModule.forChild(routes),
    AddressBookComponentModule

  ],
  entryComponents: [
    PopoverAccountComponent
  ],
  declarations: [MsigSendTransactionPage]
})
export class MsigSendTransactionPageModule {}
