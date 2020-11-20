import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/Shared/shared.module';
import { BlockchainObjectPage } from './blockchain-object.page';
import { BehaviorEscrowModule } from '../../behaviors/escrow/behavior-escrow.module';
import { BlockchainObjectCreateSuccessPage } from './create/success/blockchain-object-create-success.page';
import { BlockchainObjectCreateSummaryPage } from './create/summary/blockchain-object-create-summary.page';
import { BlockchainObjectSendSuccessPage } from './send/success/blockchain-object-send-success.page';
import { BlockchainObjectSendSummaryPage } from './send/summary/blockchain-object-send-summary.page';
import { BlockchainObjectCreatePage } from './create/blockchain-object-create.page';
import { BlockchainObjectSendPage } from './send/blockchain-object-send.page';
import { FormObjectComponent } from './components/form-object/form-object.component';
import { BlockchainObjectDetailPage } from './detail/blockchain-object-detail.page';
import { FormGetObjectComponent } from './components/form-get-object/form-get-object.component';
import { PopoverBlockchainObjectComponent } from './components/form-get-object/popover-blockchain-object/popover-blockchain-object.component';
import { BlockchainObjectItemComponent } from './components/blockchain-object-item/blockchain-object-item.component';

const routes: Routes = [
  {
    path: '',
    component: BlockchainObjectPage
  },
  {
    path: 'detail',
    component: BlockchainObjectDetailPage
  },
  {
    path: 'create',
    component: BlockchainObjectCreatePage
  },
  {
    path: 'create/summary',
    component: BlockchainObjectCreateSummaryPage
  },
  {
    path: 'create/success',
    component: BlockchainObjectCreateSuccessPage
  },
  {
    path: 'send',
    component: BlockchainObjectSendPage
  },
  {
    path: 'send/summary',
    component: BlockchainObjectSendSummaryPage
  },
  {
    path: 'send/success',
    component: BlockchainObjectSendSuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    BehaviorEscrowModule
  ],
  declarations: [
    BlockchainObjectPage,
    BlockchainObjectDetailPage,
    BlockchainObjectCreatePage,
    BlockchainObjectCreateSummaryPage,
    BlockchainObjectCreateSuccessPage,
    BlockchainObjectSendPage,
    BlockchainObjectSendSummaryPage,
    BlockchainObjectSendSuccessPage,
    FormObjectComponent,
    FormGetObjectComponent,
    PopoverBlockchainObjectComponent,
    BlockchainObjectItemComponent
  ],
  entryComponents:[
    PopoverBlockchainObjectComponent
  ]
})
export class BlockchainObjectModule {}
