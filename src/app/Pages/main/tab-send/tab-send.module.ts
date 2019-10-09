import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TabSendPage } from "./tab-send.page";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { SidemenuModule } from "src/app/Shared/sidemenu/sidemenu.module";
import { FormSelectAccountModule } from "src/app/Shared/forms/form-select-account/form-select-account.module";
import { ModalConfirmationComponent } from "./modal-confirmation/modal-confirmation.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidemenuModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabSendPage }]),
    FormSelectAccountModule
  ],
  providers: [QRScanner],
  declarations: [TabSendPage, ModalConfirmationComponent],
  entryComponents: [ModalConfirmationComponent]
})
export class TabSendPageModule {}
