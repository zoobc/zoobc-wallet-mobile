import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyTaskComponent } from "./my-task.component";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { ModalDetailComponent } from "./modal-detail/modal-detail.component";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: MyTaskComponent
  }
];

@NgModule({
  declarations: [MyTaskComponent, ModalDetailComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  entryComponents: [ModalDetailComponent]
})
export class MyTaskPageModule {}
