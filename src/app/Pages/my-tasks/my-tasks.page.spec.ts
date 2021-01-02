import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTasksPage } from './my-tasks.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';


// describe('MyTasksPage', () => {
//   let component: MyTasksPage;
//   let fixture: ComponentFixture<MyTasksPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ MyTasksPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//         TranslateModule.forRoot(),
//         RouterTestingModule,
//         IonicStorageModule.forRoot()
//       ],
//       providers:[
//         { provide: AngularFirestore },
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MyTasksPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
