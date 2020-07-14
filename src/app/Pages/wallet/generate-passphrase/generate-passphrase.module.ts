import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneratePassphrasePage } from './generate-passphrase.page';
import { ComponentsModule } from 'src/app/Components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';


const routes: Routes = [
  {
    path: '',
    component: GeneratePassphrasePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [GeneratePassphrasePage]
})
export class GeneratePassphrasePageModule { }
