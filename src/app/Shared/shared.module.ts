import { NgModule } from '@angular/core';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { ShortAddressPipe } from './pipe/short-address.pipe';
import { WithCopyComponent } from './component/with-copy/with-copy.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports:[IonicModule],
  declarations: [DateAgoPipe, ShortAddressPipe, WithCopyComponent],
  exports: [DateAgoPipe, ShortAddressPipe, WithCopyComponent]
})
export class SharedModule {}
