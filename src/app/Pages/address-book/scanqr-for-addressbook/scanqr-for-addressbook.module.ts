import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScanqrForAddressbookPage } from './scanqr-for-addressbook.page';

const routes: Routes = [
  {
    path: '',
    component: ScanqrForAddressbookPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScanqrForAddressbookPage]
})
export class ScanqrForAddressbookPageModule {}
