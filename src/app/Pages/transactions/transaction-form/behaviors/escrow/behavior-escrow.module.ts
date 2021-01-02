import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BehaviorEscrowFormComponent } from './behavior-escrow-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/Components/components.module';
import { PopoverOptionComponent } from 'src/app/Components/popover-option/popover-option.component';
import { PopoverAccountComponent } from 'src/app/Components/popover-account/popover-account.component';
import { BehaviorEscrowSummaryComponent } from './summary/behavior-escrow-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ComponentsModule
  ],
  declarations: [BehaviorEscrowFormComponent, BehaviorEscrowSummaryComponent],
  exports: [BehaviorEscrowFormComponent, BehaviorEscrowSummaryComponent],
  entryComponents: [PopoverOptionComponent, PopoverAccountComponent]
})
export class BehaviorEscrowModule {}
