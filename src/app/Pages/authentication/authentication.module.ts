import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthenticationPage } from './authentication.page';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationPage
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [AuthenticationPage]
})
export class AuthenticationPageModule {}
