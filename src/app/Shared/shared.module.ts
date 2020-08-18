import { NgModule } from '@angular/core';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';

@NgModule({
  declarations: [DateAgoPipe, ShortAddressPipe],
  exports: [DateAgoPipe, ShortAddressPipe]
})
export class SharedModule {}
