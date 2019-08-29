import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainPage } from "./main.page";

const routes: Routes = [
  {
    path: "main",
    component: MainPage,
    children: [
      {
        path: "dashboard",
        children: [
          {
            path: "",
            loadChildren:
              "./tab-dashboard/tab-dashboard.module#TabDashboardPageModule"
          }
        ]
      },
      {
        path: "receive",
        children: [
          {
            path: "",
            loadChildren:
              "./tab-receive/tab-receive.module#TabReceivePageModule"
          }
        ]
      },
      {
        path: "send",
        children: [
          {
            path: "",
            loadChildren: "./tab-send/tab-send.module#TabSendPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/main/dashboard",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/main/dashboard",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {}
