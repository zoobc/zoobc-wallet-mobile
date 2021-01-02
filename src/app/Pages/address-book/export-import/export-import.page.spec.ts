import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportImportPage } from './export-import.page';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { InjectionToken } from '@angular/core';

// describe('ExportImportPage', () => {
//   let component: ExportImportPage;
//   let fixture: ComponentFixture<ExportImportPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ExportImportPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports: [
//           TranslateModule.forRoot(),
//           FormsModule,
//           ReactiveFormsModule,
//           IonicStorageModule.forRoot(),
//           AngularFirestoreModule
//       ],
//       providers: [
//           {provide: InjectionToken},
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ExportImportPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
