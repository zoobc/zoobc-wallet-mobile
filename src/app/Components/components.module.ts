
import { NgModule } from '@angular/core';
import { PinComponent } from './pin/pin.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyComponent } from './currency/currency.component';
import { DateAgoPipe } from '../Pipes/date-ago.pipe';
import { ExchangePipe } from '../Pipes/exchange.pipe';
import { ShortAddressPipe } from '../Pipes/short-address.pipe';
import { AccountItemComponent } from './account-item/account-item.component';
import { FormAmountConversionComponent } from './form-amount-conversion/form-amount-conversion.component';
import { FormFeeComponent } from './form-fee/form-fee.component';
import { FormGetAddressComponent } from './form-get-address/form-get-address.component';
import { FormSenderComponent } from './form-sender/form-sender.component';
import { InfoAddressComponent } from './info-address/info-address.component';
import { InfoAmountConversionComponent } from './info-amount-conversion/info-amount-conversion.component';
import { PopoverAccountComponent } from './popover-account/popover-account.component';
import { PopoverOptionComponent } from './popover-option/popover-option.component';
import { SkeletonTransactionComponent } from './skeleton-transaction/skeleton-transaction.component';
import { TransactionItemComponent } from './transaction-item/transaction-item.component';
import { WithCopyComponent } from './with-copy/with-copy.component';
import { WithOptionsComponent } from './with-options/with-options.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        PinComponent,
        CurrencyComponent,
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
        PinComponent,
        CurrencyComponent,
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
    entryComponents: [PopoverOptionComponent]
})
export class ComponentsModule {
}
