import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NodeAdminComponent } from "./node-admin.component";
import { IonicModule } from "@ionic/angular";
import { SidemenuModule } from "src/app/Shared/sidemenu/sidemenu.module";

const routes: Routes = [
  {
    path: "",
    component: NodeAdminComponent
  }
];

@NgModule({
  declarations: [NodeAdminComponent],
  imports: [
    CommonModule,
    SidemenuModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class NodeAdminModule {}
