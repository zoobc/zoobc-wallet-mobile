import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabDashboardPage } from './tab-dashboard.page';
import { ComponentsModule } from 'src/app/Components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { PipeModule } from 'src/pipe/pipe.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: TabDashboardPage }]),
    ComponentsModule,
    PipeModule
  ],
  declarations: [TabDashboardPage],
  entryComponents: [],
  providers: [Network]
})
export class TabDashboardPageModule {}
