import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MsigAddParticipantsPage } from './msig-add-participants.page';

const routes: Routes = [
  {
    path: '',
    component: MsigAddParticipantsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MsigAddParticipantsPage]
})
export class MsigAddParticipantsPageModule {}
