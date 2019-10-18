import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/Components/components.module';  
import { TranslateModule } from '@ngx-translate/core';
import { SendCoinPage } from './send-coin.page';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { AddressBookComponentModule } from 'src/app/Components/address-book/address-book.module';
import { AddressBookModalComponent } from './address-book-modal/address-book-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: SendCoinPage }]),
    AddressBookComponentModule
  ],
  providers: [QRScanner],
  declarations: [SendCoinPage, AddressBookModalComponent],
  entryComponents: [AddressBookModalComponent]
})
export class SendCoinPageModule {}
