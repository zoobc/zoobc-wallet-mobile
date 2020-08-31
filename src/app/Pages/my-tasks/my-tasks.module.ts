import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { MyTasksPage } from './my-tasks.page';
import { SharedModule } from 'src/app/Shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyTasksPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [MyTasksPage]
  // entryComponents: [TaskDetailPage]
})
export class MyTasksPageModule {}
