import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionsPage } from './transactions.page';
import { TranslateModule } from '@ngx-translate/core';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

const routes: Routes = [
  {
    path: '',
    component: TransactionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionsPage, DateAgoPipe]
})
export class TransactionsPageModule {}
