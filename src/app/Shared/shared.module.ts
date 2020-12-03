import { NgModule } from '@angular/core';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';
import { WithCopyComponent } from './component/with-copy/with-copy.component';
import { IonicModule } from '@ionic/angular';
import { ExchangePipe } from './pipe/exchange.pipe';
import { PopoverOptionComponent } from './component/popover-option/popover-option.component';
import { CommonModule } from '@angular/common';
import { PopoverAccountComponent } from './component/popover-account/popover-account.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormAmountConversionComponent } from './component/form-amount-conversion/form-amount-conversion.component';
import { FormsModule } from '@angular/forms';
import { FormGetAddressComponent } from './component/form-get-address/form-get-address.component';
import { InfoAddressComponent } from './component/info-address/info-address.component';
import { InfoAmountConversionComponent } from './component/info-amount-conversion/info-amount-conversion.component';
import { FormSenderComponent } from './component/form-sender/form-sender.component';
import { FormFeeComponent } from './component/form-fee/form-fee.component';
import { TransactionItemComponent } from './component/transaction-item/transaction-item.component';
import { SkeletonTransactionComponent } from './component/skeleton-transaction/skeleton-transaction.component';
import { AccountItemComponent } from './component/account-item/account-item.component';
import { WithOptionsComponent } from './component/with-options/with-options.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule, FormsModule],
  declarations: [
    DateAgoPipe,
    ShortAddressPipe,
    WithCopyComponent,
    ExchangePipe,
    PopoverOptionComponent,
    PopoverAccountComponent,
    FormAmountConversionComponent,
    FormGetAddressComponent,
    FormSenderComponent,
    FormFeeComponent,
    InfoAddressComponent,
    InfoAmountConversionComponent,
    TransactionItemComponent,
    AccountItemComponent,
    SkeletonTransactionComponent,
    WithOptionsComponent
  ],
  exports: [
    DateAgoPipe,
    ShortAddressPipe,
    WithCopyComponent,
    PopoverOptionComponent,
    PopoverAccountComponent,
    FormAmountConversionComponent,
    FormGetAddressComponent,
    FormSenderComponent,
    FormFeeComponent,
    InfoAddressComponent,
    InfoAmountConversionComponent,
    TransactionItemComponent,
    AccountItemComponent,
    SkeletonTransactionComponent,
    WithOptionsComponent
  ],
  entryComponents: [PopoverOptionComponent]
})
export class SharedModule {}
