import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenddetailPage } from './senddetail.page';
import {TranslateModule } from '@ngx-translate/core';
import { ModalController, NavParams} from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';




// describe('SenddetailPage', () => {
//   let component: SenddetailPage;
//   let fixture: ComponentFixture<SenddetailPage>;

  
//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ SenddetailPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         HttpClientModule,
//         IonicStorageModule.forRoot()
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
//     fixture = TestBed.createComponent(SenddetailPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
