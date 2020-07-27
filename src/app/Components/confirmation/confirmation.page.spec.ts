import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationPage } from './confirmation.page';
import {TranslateModule } from '@ngx-translate/core';
import { ModalController, NavParams} from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";


// describe('Confirmation Page', () => {
//   let component: ConfirmationPage;
//   let fixture: ComponentFixture<ConfirmationPage>;

//     let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ConfirmationPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         RouterTestingModule
//         ],
//       providers:[
//         {
//           provide: ModalController,
//           useValue: modalCtrlSpy
//         },
//         { 
//           provide: NavParams, 
//           useClass: class { NavParams = jasmine.createSpy("NavParams"); }
//         } 
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ConfirmationPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
