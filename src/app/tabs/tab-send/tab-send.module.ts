import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ComponentsModule } from "src/components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { TabSendPage } from "./tab-send.page";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { AddressBookComponentModule } from "src/app/Components/address-book/address-book.module";
import { AddressBookModalComponent } from "./address-book-modal/address-book-modal.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabSendPage }]),
    AddressBookComponentModule
  ],
  providers: [QRScanner],
  declarations: [TabSendPage, AddressBookModalComponent],
  entryComponents: [AddressBookModalComponent]
})
export class TabSendPageModule {}
