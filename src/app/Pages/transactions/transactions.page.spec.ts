import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsPage } from './transactions.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

// describe('Transactiona Page', () => {
//   let component: TransactionsPage;
//   let fixture: ComponentFixture<TransactionsPage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ TransactionsPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot(),
//         HttpClientModule
//         ],
//       providers:[
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
//     fixture = TestBed.createComponent(TransactionsPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it("should return a non empty array", () => {
//     let result = component.loadData();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.loadDetailTransaction(1,"ready");
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.openDetailTransction(1);
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.openMenu();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.showLoading();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });