import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSessionPage } from './chat-session.page';
import {TranslateModule } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { IonicStorageModule } from '@ionic/storage';

// describe('Notifications Page', () => {
//   let component: ChatSessionPage;
//   let fixture: ComponentFixture<ChatSessionPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ChatSessionPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot()
//         ],
//       providers:[
//         { provide: AngularFirestore },
//         LocalNotifications
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ChatSessionPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });