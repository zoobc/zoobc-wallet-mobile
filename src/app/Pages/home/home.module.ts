import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule
  ],
  declarations: [HomePage],
  entryComponents: [PopoverAccountComponent]
})
export class HomePageModule {}
