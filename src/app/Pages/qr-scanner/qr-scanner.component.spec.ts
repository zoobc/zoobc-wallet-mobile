// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { QrScannerComponent } from './qr-scanner.component';
// import { TranslateModule } from "@ngx-translate/core";
// import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
// import { RouterTestingModule } from '@angular/router/testing';

// describe('QrScannerComponent', () => {
//   let component: QrScannerComponent;
//   let fixture: ComponentFixture<QrScannerComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ QrScannerComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//           TranslateModule.forRoot(),
//           RouterTestingModule,
//       ],
//       providers:[
//           {provide: BarcodeScanner},
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(QrScannerComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it("init worked", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
