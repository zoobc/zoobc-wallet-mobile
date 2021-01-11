import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MsigTaskDetailPage } from './msig-task-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/Components/components.module';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';

const routes: Routes = [
  {
    path: '',
    component: MsigTaskDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    PopoverAccountComponent
  ],
  declarations: [MsigTaskDetailPage]
})
export class MsigTaskDetailPageModule {}
