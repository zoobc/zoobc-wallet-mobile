import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: './tab-dashboard/tab-dashboard.module#TabDashboardPageModule'
          }
        ],
      },
      {
        path: 'receive',
        children: [
          {
            path: '',
            loadChildren: './tab-receive/tab-receive.module#TabReceivePageModule'
          }
        ]
      },
      {
        path: 'send',
        children: [
          {
            path: '',
            loadChildren: './tab-send/tab-send.module#TabSendPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
