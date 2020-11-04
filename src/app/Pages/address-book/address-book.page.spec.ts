import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressBookPage } from './address-book.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import {Location} from '@angular/common';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

// describe('AddressBookPage', () => {
//   let component: AddressBookPage;
//   let fixture: ComponentFixture<AddressBookPage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ AddressBookPage ],
//       imports:[
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot(),
//       ],
//       providers: [
//         Location,
//         Clipboard,
//         {
//           provide: ModalController,
//           useValue: modalCtrlSpy
//         },
//         { provide: AngularFirestore },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AddressBookPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
