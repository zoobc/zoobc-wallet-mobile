import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



// describe('LoginPage', () => {
//   let component: LoginPage;
//   let fixture: ComponentFixture<LoginPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ LoginPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//         TranslateModule.forRoot(),
//         IonicStorageModule.forRoot(),
//         RouterModule.forRoot([]),
//         HttpClientModule
//       ],
//       providers:[
//         { provide: 'global', useFactory: () => window.global.Number(1234) },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it("login worked", () => {
//     let result = component.login(1);
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("ion view worked", () => {
//     let result = component.ionViewDidEnter();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("init worked", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
