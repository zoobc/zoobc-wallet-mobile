import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabReceivePage } from './tab-receive.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: TabReceivePage }])
  ],
  declarations: [TabReceivePage]
})
export class TabReceivePageModule { }
