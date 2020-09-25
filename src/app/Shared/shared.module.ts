import { NgModule } from '@angular/core';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';
import { WithCopyComponent } from './component/with-copy/with-copy.component';
import { IonicModule } from '@ionic/angular';
import { ExchangePipe } from './pipe/exchange.pipe';
import { PopoverOptionComponent } from './component/popover-option/popover-option.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [DateAgoPipe, ShortAddressPipe, WithCopyComponent, ExchangePipe, PopoverOptionComponent],
  exports: [DateAgoPipe, ShortAddressPipe, WithCopyComponent, PopoverOptionComponent]
})
export class SharedModule {}
