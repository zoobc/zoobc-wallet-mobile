import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountComponent } from './list-account.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';
import { PopoverActionComponent } from './popover-action/popover-action.component';
import { PopoverOptionComponent } from 'src/app/Shared/component/popover-option/popover-option.component';

const routes: Routes = [
  {
    path: '',
    component: ListAccountComponent
  }
];

@NgModule({
  declarations: [ListAccountComponent, PopoverActionComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  entryComponents: [PopoverActionComponent, PopoverOptionComponent]
})
export class ListAccountModule {}
