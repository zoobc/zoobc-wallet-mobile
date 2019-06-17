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
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { NgxsModule } from '@ngxs/store';
import { PinComponent } from 'src/components/pin/pin.component';

// import * as supercop from 'supercop.wasm';
import { sign as naclSign } from 'tweetnacl';
import { ObservableService } from 'src/services/observable.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppConfigModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    NgxsModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: "global", useFactory: () => window },
    { provide: "nacl.sign", useFactory: () => naclSign },
    // { provide: "supercop", useFactory: () => supercop },
    ObservableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
