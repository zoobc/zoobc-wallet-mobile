import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CreateAccountPage } from './create-account.page';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { ComponentsModule } from 'src/app/Components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CreateAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [CreateAccountPage],
  entryComponents: [PopoverOptionComponent, PopoverAccountComponent]
})
export class CreateAccountPageModule {}
