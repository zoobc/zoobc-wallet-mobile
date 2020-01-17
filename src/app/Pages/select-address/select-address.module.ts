import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
<<<<<<< HEAD:src/app/Pages/create-account/create-account.module.ts
import { TranslateModule } from '@ngx-translate/core';
import { CreateAccountPage } from './create-account.page';
=======

import { SelectAddressPage } from './select-address.page';
>>>>>>> 6238c45f96fc4bae2649c7e0732f0d4889d420ae:src/app/Pages/select-address/select-address.module.ts

const routes: Routes = [
  {
    path: '',
    component: SelectAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectAddressPage]
})
export class SelectAddressPageModule {}
