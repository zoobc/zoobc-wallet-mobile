import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePassphrasePage } from './generate-passphrase.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

// describe('Generate Passphrase Page', () => {
//   let component: GeneratePassphrasePage;
//   let fixture: ComponentFixture<GeneratePassphrasePage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ GeneratePassphrasePage ],
//       imports: [
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot()
//         ],
//       providers:[
//         Clipboard,
//         {
//           provide: ModalController,
//           useValue: modalCtrlSpy
//         },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GeneratePassphrasePage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
