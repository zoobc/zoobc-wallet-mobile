import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPage } from './about.page';
import { TranslateModule } from "@ngx-translate/core";

// describe('AboutPage', () => {

//   let translate: TranslateModule;

//   let component: AboutPage;
//   let fixture: ComponentFixture<AboutPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ AboutPage ],
//       imports: [
//         TranslateModule.forRoot(),
//         ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports: [
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useFactory: (createTranslateLoader),
//             deps: [HttpClient]
//           }
//         })
//       ],
//       providers: [TranslateService, HttpClient, HttpHandler]
//     })
//     .compileComponents();
//     translate = TestBed.get(TranslateService);

//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AboutPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
