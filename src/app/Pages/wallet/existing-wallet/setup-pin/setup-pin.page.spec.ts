import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPinPage } from './setup-pin.page';
import {TranslateModule } from '@ngx-translate/core';
import { ModalController} from '@ionic/angular';

// describe('SetupPin', () => {
//   let component: SetupPinPage;
//   let fixture: ComponentFixture<SetupPinPage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ SetupPinPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         ],
//         providers:[
//           {
//             provide: ModalController,
//             useValue: modalCtrlSpy
//           },
//         ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SetupPinPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
