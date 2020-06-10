import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccMultisigInfoPage } from './acc-multisig-info.page';

const routes: Routes = [
  {
    path: '',
    component: AccMultisigInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccMultisigInfoPage]
})
export class AccMultisigInfoPageModule {}
