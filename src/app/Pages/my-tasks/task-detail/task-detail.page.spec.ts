import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailPage } from './task-detail.page';
import {TranslateModule } from '@ngx-translate/core';
import { ModalController} from '@ionic/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { IonicStorageModule } from '@ionic/storage';

// describe('TaskDetailPage', () => {
//   let component: TaskDetailPage;
//   let fixture: ComponentFixture<TaskDetailPage>;

//   let modalSpy = jasmine.createSpyObj('Modal', ['present']);
//   let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

//   modalCtrlSpy.create.and.callFake(function () {
//     return modalSpy;
//   });
  
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ TaskDetailPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot()
//         ],
//         providers:[
//           Clipboard,
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
//     fixture = TestBed.createComponent(TaskDetailPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it("should return a non empty array", () => {
//     let result = component.showPin();
//     expect(Array.isArray(result)).toBeTruthy;
//   });

//   it("should return a non empty array", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
