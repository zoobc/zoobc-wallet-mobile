import { NgModule } from '@angular/core';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';
import { WithCopyComponent } from './component/with-copy/with-copy.component';
import { IonicModule } from '@ionic/angular';
import { ExchangePipe } from './pipe/exchange.pipe';

@NgModule({
  imports:[IonicModule],
  declarations: [DateAgoPipe, ShortAddressPipe, WithCopyComponent, ExchangePipe],
  exports: [DateAgoPipe, ShortAddressPipe, WithCopyComponent]
})
export class SharedModule {}
