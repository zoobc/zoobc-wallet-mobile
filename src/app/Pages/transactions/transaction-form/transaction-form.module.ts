import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionFormPage } from './transaction-form.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TransactionFormPage
  },
  {
    path: 'send-money',
    loadChildren: './pages/send-money/send-money.module#SendMoneyModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TransactionFormPage]
})
export class TransactionFormPageModule {}
