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

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule],
  declarations: [
    DateAgoPipe,
    ShortAddressPipe,
    WithCopyComponent,
    ExchangePipe,
    PopoverOptionComponent,
    PopoverAccountComponent
  ],
  exports: [
    DateAgoPipe,
    ShortAddressPipe,
    WithCopyComponent,
    PopoverOptionComponent,
    PopoverAccountComponent
  ]
})
export class SharedModule {}
