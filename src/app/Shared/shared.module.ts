import { NgModule } from '@angular/core';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { IonicModule } from '@ionic/angular';
import { ExchangePipe } from './pipe/exchange.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';

@NgModule({
  imports:[IonicModule],
  declarations: [DateAgoPipe, ExchangePipe, ShortAddressPipe],
  exports: [DateAgoPipe, ExchangePipe, ShortAddressPipe]
})
export class SharedModule {}
