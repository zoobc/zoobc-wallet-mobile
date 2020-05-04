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
// import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LanguageService } from './Services/language.service';
import { SenddetailPageModule } from './Pages/send-coin/modals/senddetail/senddetail.module';
import { TrxstatusPageModule } from './Pages/send-coin/modals/trxstatus/trxstatus.module';
import { EnterpinsendPageModule } from './Pages/send-coin/modals/enterpinsend/enterpinsend.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TransactionDetailPageModule } from './Pages/transaction-detail/transaction-detail.module';
import { SetupPinPageModule } from 'src/app/Pages/setup-pin/setup-pin.module';
import { AddressBookService } from './Services/address-book.service';
import { fbconfig } from 'src/environments/firebaseconfig';
import { PinBackupPageModule } from './Pages/backup-phrase/pin/pin-backup/pin-backup.module';
import { TaskDetailPageModule } from './Pages/my-tasks/task-detail/task-detail.module';
import { SetupPinGpPageModule } from './Pages/generate-passphrase/setup-pin-gp/setup-pin-gp.module';
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
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, QrScannerComponent],
  entryComponents: [],
  imports: [
    NgxQRCodeModule,
    BrowserModule,
    IonicModule.forRoot(),
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
    TaskDetailPageModule,
    SetupPinGpPageModule,
    SetupPinPageModule,
    EnterpinsendPageModule,
    PinBackupPageModule,
    ChatProfilePageModule,
    AngularFireModule.initializeApp(fbconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    LanguageService,
    AddressBookService,
    File,
    // QRScanner,
    BarcodeScanner,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: 'global', useFactory: () => window },
    { provide: 'nacl.sign', useFactory: () => naclSign },
    OneSignal,
    LocalNotifications,
    ObservableService,
    Clipboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
