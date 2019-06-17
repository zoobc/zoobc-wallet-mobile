import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExistingWalletPage } from './existing-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ExistingWalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExistingWalletPage]
})
export class ExistingWalletPageModule {}
