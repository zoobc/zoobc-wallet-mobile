import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';
import { PopoverAccountComponent } from 'src/app/Shared/component/popover-account/popover-account.component';
import { PopoverBlockchainObjectOptionComponent } from './popover-blockchain-object-option/popover-blockchain-object-option.component';

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
  declarations: [HomePage, PopoverBlockchainObjectOptionComponent],
  entryComponents: [PopoverAccountComponent, PopoverBlockchainObjectOptionComponent]
})
export class HomePageModule {}
