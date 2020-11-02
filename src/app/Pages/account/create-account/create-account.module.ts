import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CreateAccountPage } from './create-account.page';
import { SharedModule } from 'src/app/Shared/shared.module';
import { PopoverOptionComponent } from 'src/app/Shared/component/popover-option/popover-option.component';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';

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
    SharedModule
  ],
  declarations: [CreateAccountPage],
  entryComponents:[PopoverOptionComponent, PopoverAccountComponent]
})
export class CreateAccountPageModule {}
