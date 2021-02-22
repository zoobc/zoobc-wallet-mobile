// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { NgModule } from '@angular/core';
import { PinComponent } from './pin/pin.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EscrowApprovalFormComponent } from '../Pages/multisig/escrow-approval-form/escrow-approval-form.component';
import { FormTransferZoobcComponent } from './transactions/form-transfer-zoobc/form-transfer-zoobc.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        WithOptionsComponent,
        FormTransferZoobcComponent,
        EscrowApprovalFormComponent
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
        FormTransferZoobcComponent,
        WithOptionsComponent,
        EscrowApprovalFormComponent
    ],
    entryComponents: [PopoverOptionComponent]
})
export class ComponentsModule {
}
