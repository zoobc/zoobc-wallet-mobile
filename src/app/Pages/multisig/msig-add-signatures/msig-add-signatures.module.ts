import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigAddSignaturesPage } from './msig-add-signatures.page';

const routes: Routes = [
  {
    path: '',
    component: MsigAddSignaturesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MsigAddSignaturesPage]
})
export class MsigAddSignaturesPageModule {}