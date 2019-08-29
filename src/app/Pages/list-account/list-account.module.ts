import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListAccountComponent } from "./list-account.component";
import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ModalCreateAccountComponent } from "./modal-create-account/modal-create-account.component";

const routes: Routes = [
  {
    path: "",
    component: ListAccountComponent
  }
];

@NgModule({
  declarations: [ListAccountComponent, ModalCreateAccountComponent],
  entryComponents: [ModalCreateAccountComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class ListAccountModule {}
