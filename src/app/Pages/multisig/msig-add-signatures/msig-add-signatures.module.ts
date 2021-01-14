import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigAddSignaturesPage } from './msig-add-signatures.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/Components/components.module';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';

const routes: Routes = [
  {
    path: '',
    component: MsigAddSignaturesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    PopoverAccountComponent
  ],
  declarations: [MsigAddSignaturesPage]
})
export class MsigAddSignaturesPageModule {}
