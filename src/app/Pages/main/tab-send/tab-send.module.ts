import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TabSendPage } from "./tab-send.page";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { AddressBookComponentModule } from "src/app/Components/address-book/address-book.module";
import { SidemenuModule } from "src/app/Components/sidemenu/sidemenu.module";
import { FormSelectAccountModule } from "src/app/Components/forms/form-select-account/form-select-account.module";
import { ModalAddressBookComponent } from "./modal-address-book/modal-address-book.component";
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
    AddressBookComponentModule,
    FormSelectAccountModule
  ],
  providers: [QRScanner],
  declarations: [
    TabSendPage,
    ModalAddressBookComponent,
    ModalConfirmationComponent
  ],
  entryComponents: [ModalAddressBookComponent, ModalConfirmationComponent]
})
export class TabSendPageModule {}
