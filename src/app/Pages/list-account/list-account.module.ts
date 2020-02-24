import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountComponent } from './list-account.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ListAccountComponent
  }
];

@NgModule({
  declarations: [ListAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class ListAccountModule {}
