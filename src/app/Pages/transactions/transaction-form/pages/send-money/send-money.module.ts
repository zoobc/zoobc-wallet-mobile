import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SendMoneyFormComponent } from './send-money-form.component';
import { SendMoneySummaryComponent } from './summary/send-money-summary.component';
import { BehaviorEscrowModule } from '../../behaviors/escrow/behavior-escrow.module';
import { SendMoneySuccessPage } from './success/send-money-success.page';
import { ComponentsModule } from 'src/app/Components/components.module';

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
    ComponentsModule,
    BehaviorEscrowModule
  ],
  declarations: [
    SendMoneyFormComponent,
    SendMoneySummaryComponent,
    SendMoneySuccessPage
  ]
})
export class SendMoneyModule {}
