import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigCreateInfoPage } from './msig-create-info.page';

const routes: Routes = [
  {
    path: '',
    component: MsigCreateInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MsigCreateInfoPage]
})
export class MsigCreateInfoPageModule {}
