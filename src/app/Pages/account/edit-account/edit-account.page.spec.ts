import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAccountPage } from './edit-account.page';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage';
import { RouterModule } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController} from '@ionic/angular';


// let modalSpy = jasmine.createSpyObj('Modal', ['present']);
// let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);


// modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

// describe('EditAccountPage', () => {
//   let component: EditAccountPage;
//   let fixture: ComponentFixture<EditAccountPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ 
//           EditAccountPage,
//         ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports: [
//           TranslateModule.forRoot(),
//           IonicStorageModule.forRoot(),
//           RouterModule.forRoot([]),
//       ],
//       providers:[
//         { provide: AngularFirestore },
//         { provide: AndroidPermissions },
//         { provide: File },
//         Clipboard,
//         {
//             provide: ModalController,
//             useValue: modalCtrlSpy
//         },
//       ],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditAccountPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
