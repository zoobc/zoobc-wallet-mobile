import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAccountComponent } from './list-account.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverActionComponent } from './popover-action/popover-action.component';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { ComponentsModule } from 'src/app/Components/components.module';

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
    ComponentsModule
  ],
  entryComponents: [PopoverActionComponent, PopoverOptionComponent]
})
export class ListAccountModule {}
