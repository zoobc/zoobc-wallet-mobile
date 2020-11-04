import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAccountComponent } from './list-account.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

// let modalSpy = jasmine.createSpyObj('Modal', ['present']);
// let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
// modalCtrlSpy.create.and.callFake(function () {
//   return modalSpy;
// });

// describe('ListAccountComponent', () => {
//   let component: ListAccountComponent;
//   let fixture: ComponentFixture<ListAccountComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ListAccountComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//         TranslateModule.forRoot(),
//         RouterModule.forRoot([]),
//         IonicStorageModule.forRoot()
//       ],
//       providers:[
//         Clipboard,
//         {
//           provide: ModalController,
//           useValue: modalCtrlSpy
//         },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ListAccountComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });

//   it("should return a non empty array", () => {
//     let result = component.goToDashboard();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.goToSendMoney();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.loadData();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
