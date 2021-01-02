import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'task',
        loadChildren: '../my-tasks/my-tasks.module#MyTasksPageModule'
      },
      {
        path: 'app',
        loadChildren: '../apps/applist/applist.module#ApplistPageModule'
      },
      {
        path: 'contact',
        loadChildren:
          '../address-book/address-book.module#AddressBookPageModule'
      },
      {
        path: 'setting',
        loadChildren: '../settings/settings.module#SettingsPageModule'
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
