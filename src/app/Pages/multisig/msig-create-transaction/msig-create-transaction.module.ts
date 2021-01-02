import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book-list/address-book.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyComponent } from 'src/app/Components/currency/currency.component';
import { MsigCreateTransactionPage } from './msig-create-transaction.page';
import { ComponentsModule } from 'src/app/Components/components.module';
import { FormEscrowComponent } from 'src/app/Components/transactions/form-escrow/form-escrow.component';
import { FormSendMoneyComponent } from 'src/app/Components/transactions/form-send-money/form-send-money.component';
// tslint:disable-next-line:max-line-length
import { FormSetupAccountDatasetComponent } from 'src/app/Components/transactions/form-setup-account-dataset/form-setup-account-dataset.component';
import { FormEscrowApprovalComponent } from 'src/app/Components/transactions/form-escrow-approval/form-escrow-approval.component';
// tslint:disable-next-line:max-line-length
import { FormRemoveAccountDatasetComponent } from 'src/app/Components/transactions/form-remove-account-dataset/form-remove-account-dataset.component';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';

const routes: Routes = [
  {
    path: '',
    component: MsigCreateTransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    AddressBookComponentModule
  ],
  entryComponents: [
    CurrencyComponent,
    FormEscrowComponent,
    FormSendMoneyComponent,
    FormSetupAccountDatasetComponent,
    FormRemoveAccountDatasetComponent,
    FormEscrowApprovalComponent,
    PopoverAccountComponent
  ],
  declarations: [
    MsigCreateTransactionPage,
    FormEscrowComponent,
    FormSendMoneyComponent,
    FormSetupAccountDatasetComponent,
    FormRemoveAccountDatasetComponent,
    FormEscrowApprovalComponent]
})
export class MsigCreateTransactionPageModule {}
