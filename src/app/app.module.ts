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
import { sign as naclSign } from 'tweetnacl';
import { ObservableService } from 'src/app/Services/observable.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QrScannerComponent } from 'src/app/Pages/qr-scanner/qr-scanner.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LanguageService } from './Services/language.service';
import { SenddetailPageModule } from './Pages/send-coin/modals/senddetail/senddetail.module';
import { TrxstatusPageModule } from './Pages/send-coin/modals/trxstatus/trxstatus.module';
import { EnterpinsendPageModule } from './Pages/send-coin/modals/enterpinsend/enterpinsend.module';
import { TransactionDetailPageModule } from './Pages/transactions/transaction-detail/transaction-detail.module';
import { SetupPinPageModule } from 'src/app/Pages/wallet/existing-wallet/setup-pin/setup-pin.module';
import { fbconfig } from 'src/environments/firebaseconfig';
import { PinBackupPageModule } from './Pages/wallet/backup-phrase/pin/pin-backup/pin-backup.module';
import { TaskDetailPageModule } from './Pages/my-tasks/task-detail/task-detail.module';
import { SetupPinGpPageModule } from './Pages/wallet/generate-passphrase/setup-pin-gp/setup-pin-gp.module';
import { File } from '@ionic-native/file/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ChatProfilePageModule } from './Pages/chat/chat-profile/chat-profile.module';
import { ConfirmationPageModule } from './Components/confirmation/confirmation.module';
import { DecimalPipe } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AccountPopupPageModule } from './Pages/account/account-popup/account-popup.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PopupCurrencyPageModule } from './Pages/settings/popup-currency/popup-currency.module';
import { PopupLanguagesPageModule } from './Pages/settings/popup-languages/popup-languages.module';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ImportAccountPageModule } from './Pages/account/import-account/import-account.module';
import { SharedModule } from './Shared/shared.module';
import { DateAgoPipe } from './Shared/pipe/date-ago.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
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
    SenddetailPageModule,
    TransactionDetailPageModule,
    TrxstatusPageModule,
    ConfirmationPageModule,
    TaskDetailPageModule,
    SetupPinGpPageModule,
    SetupPinPageModule,
    EnterpinsendPageModule,
    ImportAccountPageModule,
    PinBackupPageModule,
    ChatProfilePageModule,
    AccountPopupPageModule,
    PopupCurrencyPageModule,
    PopupLanguagesPageModule,
    AngularFireModule.initializeApp(fbconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxQRCodeModule,
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    File,
    FileChooser,
    FilePath,
    BarcodeScanner,
    AndroidPermissions,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'global', useFactory: () => window },
    { provide: 'nacl.sign', useFactory: () => naclSign },
    OneSignal,
    Clipboard,
    LanguageService,
    DecimalPipe,
    DateAgoPipe,
    ObservableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
