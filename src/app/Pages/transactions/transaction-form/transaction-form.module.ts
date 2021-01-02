import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionFormPage } from './transaction-form.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TransactionFormPage
  },
  {
    path: 'send-money',
    loadChildren: './pages/send-money/send-money.module#SendMoneyModule'
  },
  {
    path: 'blockchain-object',
    loadChildren: './pages/blockchain-object/blockchain-object.module#BlockchainObjectModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [TransactionFormPage]
})
export class TransactionFormPageModule {}
