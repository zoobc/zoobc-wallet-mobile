import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

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
    RouterModule.forChild(routes)
  ],
  declarations: [MsigCreateTransactionPage]
})
export class MsigCreateTransactionPageModule {}
