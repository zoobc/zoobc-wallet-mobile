import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BackuprestoreAddressPage } from './backuprestore-address.page';

const routes: Routes = [
  {
    path: '',
    component: BackuprestoreAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BackuprestoreAddressPage]
})
export class BackuprestoreAddressPageModule {}
