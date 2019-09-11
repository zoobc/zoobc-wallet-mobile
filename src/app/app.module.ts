import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppConfigModule } from "./app-config.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { NgxsModule } from '@ngxs/store';
import { Network } from '@ionic-native/network/ngx';
import { sign as naclSign } from 'tweetnacl';
import { ObservableService } from 'src/services/observable.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/languages/locales/', '.json');
}

@NgModule({
  declarations: [AppComponent, QrScannerComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppConfigModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot(),
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
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: "global", useFactory: () => window },
    { provide: "nacl.sign", useFactory: () => naclSign },
    // { provide: "supercop", useFactory: () => supercop },
    ObservableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
