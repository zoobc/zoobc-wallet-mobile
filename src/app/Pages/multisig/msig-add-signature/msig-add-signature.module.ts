import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigAddSignaturePage } from './msig-add-signature.page';

const routes: Routes = [
  {
    path: '',
    component: MsigAddSignaturePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MsigAddSignaturePage]
})
export class MsigAddSignaturePageModule {}
