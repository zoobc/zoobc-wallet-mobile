import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectSendPage } from './blockchain-object-send.page';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Network } from '@ionic-native/network/ngx';

// let modalSpy = jasmine.createSpyObj('Modal', ['present']);
// let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

// modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });

  
// describe('BlockchainObjectSendPage', () => {
//   let component: BlockchainObjectSendPage;
//   let fixture: ComponentFixture<BlockchainObjectSendPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ BlockchainObjectSendPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports: [
//           TranslateModule.forRoot(),
//           FormsModule,
//           ReactiveFormsModule,
//           RouterModule.forRoot([]),
//           IonicStorageModule.forRoot(),
//       ],
//       providers:[
//         {
//             provide: ModalController,
//             useValue: modalCtrlSpy
//           },
//         {
//             provide: AngularFirestore
//         },
//         {
//             provide: Network
//         }
//       ],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(BlockchainObjectSendPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
