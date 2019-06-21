import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { TabSendPage } from './tab-send.page';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: TabSendPage }])
  ],
  providers: [
    QRScanner
  ],
  declarations: [TabSendPage]
})
export class TabSendPageModule { }
