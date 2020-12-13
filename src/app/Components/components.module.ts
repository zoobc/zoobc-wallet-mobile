
import { NgModule } from '@angular/core';
import { PinComponent } from './pin/pin.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyComponent } from './currency/currency.component';
import { InputAmountComponent } from './input-amount/input-amount.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        PinComponent,
        CurrencyComponent
    ],
    exports: [
        PinComponent,
        CurrencyComponent
    ]
})
export class ComponentsModule {
}
