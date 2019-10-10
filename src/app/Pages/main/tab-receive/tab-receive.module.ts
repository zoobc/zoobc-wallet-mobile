import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TabReceivePage } from "./tab-receive.page";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { AddressElipsisModule } from "src/app/Shared/address-elipsis/address-elipsis.module";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild([{ path: "", component: TabReceivePage }]),
    AddressElipsisModule
  ],
  providers: [Clipboard, SocialSharing],
  declarations: [TabReceivePage]
})
export class TabReceivePageModule {}
