import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';
import { SendMoneyFormComponent } from './send-money-form.component';
import { SendMoneySummaryComponent } from './summary/send-money-summary.component';
import { BehaviorEscrowModule } from '../../behaviors/escrow/behavior-escrow.module';
import { SendMoneySuccessPage } from './success/send-money-success.page';

const routes: Routes = [
  {
    path: '',
    component: SendMoneyFormComponent
  },
  {
    path: 'summary',
    component: SendMoneySummaryComponent
  },
  {
    path: 'success',
    component: SendMoneySuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    BehaviorEscrowModule
  ],
  declarations: [
    SendMoneyFormComponent,
    SendMoneySummaryComponent,
    SendMoneySuccessPage
  ]
})
export class SendMoneyModule {}
