import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EnterpinsendPage } from './enterpinsend.page';
import { ComponentsModule } from 'src/app/Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: EnterpinsendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EnterpinsendPage]
})
export class EnterpinsendPageModule {}
