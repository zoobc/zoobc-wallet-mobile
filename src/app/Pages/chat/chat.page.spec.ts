import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatPage } from './chat.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { fbconfig } from 'src/environments/firebaseconfig';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IonicStorageModule } from '@ionic/storage';

// describe('ChatPage', () => {
//   let component: ChatPage;
//   let fixture: ComponentFixture<ChatPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ChatPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         AngularFireAuthModule,
//         AngularFireModule.initializeApp(fbconfig),
//         IonicStorageModule.forRoot(),
//       ],
//       providers:[
//         OneSignal,
//         { provide: AngularFirestore },
//         LocalNotifications
//       ]

//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ChatPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
