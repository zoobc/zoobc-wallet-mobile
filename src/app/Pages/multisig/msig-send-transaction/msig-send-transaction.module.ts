import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigSendTransactionPage } from './msig-send-transaction.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [MsigSendTransactionPage]
})
export class MsigSendTransactionPageModule {}
