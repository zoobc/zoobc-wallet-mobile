import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddressPage } from './add-address.page';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from "@angular/router/testing";

// describe('AddAddressPage', () => {
//   let component: AddAddressPage;
//   let fixture: ComponentFixture<AddAddressPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ AddAddressPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         IonicStorageModule.forRoot(),
//         RouterTestingModule
//         ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       providers: [
//         { provide: AngularFirestore },
//       ],
//     })
//     .compileComponents();

//     component = new AddAddressPage(null, null, null, null);
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AddAddressPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it("should return a non empty array", () => {
//     let result = component.getAllAddress();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = component.goListAddress();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.isAddressExists("127.0.0.1","test");
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.isNameExists("zbc","202.130.122.1");
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.saveAddress();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("should return a non empty array", () => {
//     let result = component.scanQRCode();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
