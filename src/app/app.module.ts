// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppConfigModule } from './app-config.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { Network } from '@ionic-native/network/ngx';
import { ObservableService } from 'src/app/Services/observable.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QrScannerComponent } from 'src/app/Pages/qr-scanner/qr-scanner.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LanguageService } from './Services/language.service';
import { TrxstatusPageModule } from './Pages/send-coin/modals/trxstatus/trxstatus.module';
import { EnterpinsendPageModule } from './Pages/send-coin/modals/enterpinsend/enterpinsend.module';
import { TransactionDetailPageModule } from './Pages/transactions/transaction-detail/transaction-detail.module';
import { SetupPinPageModule } from 'src/app/Pages/wallet/existing-wallet/setup-pin/setup-pin.module';
import { PinBackupPageModule } from './Pages/wallet/backup-phrase/pin/pin-backup/pin-backup.module';
import { TaskDetailPageModule } from './Pages/my-tasks/task-detail/task-detail.module';
import { SetupPinGpPageModule } from './Pages/wallet/generate-passphrase/setup-pin-gp/setup-pin-gp.module';
import { File } from '@ionic-native/file/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ConfirmationPageModule } from './Components/confirmation/confirmation.module';
import { DecimalPipe } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AccountPopupPageModule } from './Pages/account/account-popup/account-popup.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PopupCurrencyPageModule } from './Pages/settings/popup-currency/popup-currency.module';
import { PopupLanguagesPageModule } from './Pages/settings/popup-languages/popup-languages.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DateAgoPipe } from './Pipes/date-ago.pipe';
import { DatasetAccountPageModule } from './Pages/account/dataset-account/dataset-account.module';
import { NewDatasetPageModule } from './Pages/account/dataset-account/new-dataset/new-dataset.module';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ImportAccountPageModule } from './Pages/account/import-account/import-account.module';
import { ImportDraftPageModule } from './Pages/multisig/import-draft/import-draft.module';
import { ComponentsModule } from './Components/components.module';
import { MyTasksPageModule } from './Pages/my-tasks/my-tasks.module';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PkeyPinPageModule } from './Pages/wallet/private-key/pkey-pin/pkey-pin.module';
import { AddressPinPageModule } from './Pages/wallet/zbc-address/address-pin/address-pin.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/language/locales/', '.json');
}

@NgModule({
  declarations: [AppComponent, QrScannerComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule,
    IonicStorageModule.forRoot({
      name: '__zobcdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AppConfigModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot(),
    TransactionDetailPageModule,
    TrxstatusPageModule,
    ConfirmationPageModule,
    TaskDetailPageModule,
    SetupPinGpPageModule,
    PinBackupPageModule,
    SetupPinPageModule,
    AddressPinPageModule,
    PkeyPinPageModule,
    EnterpinsendPageModule,
    ImportDraftPageModule,
    ImportAccountPageModule,
    DatasetAccountPageModule,
    MyTasksPageModule,
    AccountPopupPageModule,
    PopupCurrencyPageModule,
    PopupLanguagesPageModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxQRCodeModule,
    NewDatasetPageModule
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    File,
    AppVersion,
    FileChooser,
    InAppBrowser,
    FilePath,
    BarcodeScanner,
    AndroidPermissions,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'global', useFactory: () => window },
    Clipboard,
    LanguageService,
    DatePicker,
    DecimalPipe,
    DateAgoPipe,
    ObservableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
