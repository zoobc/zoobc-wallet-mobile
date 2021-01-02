import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TaskDetailPage } from './task-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [TaskDetailPage]
})
export class TaskDetailPageModule {}
