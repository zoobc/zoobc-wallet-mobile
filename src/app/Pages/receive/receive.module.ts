import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReceivePage } from './receive.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ReceivePage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ReceivePage]
})
export class ReceivePageModule {}
