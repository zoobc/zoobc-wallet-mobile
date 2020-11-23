import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// export const firebaseConfig = {
//   apiKey: 'put-firebase',
//   authDomain: '',
//   databaseURL: '',
//   projectId: 'mydatabaseid-XXXX',
//   storageBucket: '',
//   messagingSenderId: ''
// }

// describe('AppComponent', () => {

//   let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

//   beforeEach(async(() => {
//     statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
//     splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
//     platformReadySpy = Promise.resolve();
//     platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });

//     TestBed.configureTestingModule({
//       declarations: [AppComponent],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//         AngularFireModule.initializeApp(firebaseConfig),
//         AngularFireAuthModule,
//         AngularFirestoreModule,
//         TranslateModule.forRoot(),
//         IonicStorageModule.forRoot(),
//         HttpClientTestingModule,
//       ],
//       providers: [
//         { provide: StatusBar, useValue: statusBarSpy },
//         { provide: SplashScreen, useValue: splashScreenSpy },
//         { provide: Platform, useValue: platformSpy },
//         OneSignal,
//         Network
//       ],
//     }).compileComponents();
//   }));

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it('should initialize the app', async () => {
//     TestBed.createComponent(AppComponent);
//     expect(platformSpy.ready).toHaveBeenCalled();
//     await platformReadySpy;
//     expect(statusBarSpy.styleDefault).toHaveBeenCalled();
//     expect(splashScreenSpy.hide).toHaveBeenCalled();
//   });

//   // TODO: add more tests!

// });
