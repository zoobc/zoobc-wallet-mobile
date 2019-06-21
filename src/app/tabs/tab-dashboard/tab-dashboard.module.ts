import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabDashboardPage } from './tab-dashboard.page';
import { ComponentsModule } from 'src/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: TabDashboardPage }]),
    ComponentsModule,
    TranslateModule
  ],
  declarations: [TabDashboardPage]
})
export class TabDashboardPageModule { }
