import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from "@angular/common/http";
import { sign as naclSign } from 'tweetnacl';
import { ModalController} from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

// export const firebaseConfig = {
//   apiKey: 'put-firebase',
//   authDomain: '',
//   databaseURL: '',
//   projectId: 'mydatabaseid-XXXX',
//   storageBucket: '',
//   messagingSenderId: ''
// }

// describe('DashboardPage', () => {
//   let component: DashboardPage;
//   let fixture: ComponentFixture<DashboardPage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ DashboardPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//                 TranslateModule.forRoot(),
//                 RouterTestingModule,
//                 IonicStorageModule.forRoot(),
//                 HttpClientModule,
//                 AngularFireAuthModule,
//                 AngularFireModule.initializeApp(firebaseConfig)
//       ],
//       providers:[
//         { provide: 'global', useFactory: () => '' },
//         { provide: 'nacl.sign', useFactory: () => naclSign },
//         {
//           provide: ModalController,
//           useValue: modalCtrlSpy
//         },
//         OneSignal,
//         { provide: AngularFirestore },
//         // LocalNotifications
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DashboardPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
