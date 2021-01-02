import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAddressComponent } from './form-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule} from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

describe('FormAddressComponent', () => {
  let component: FormAddressComponent;
  let fixture: ComponentFixture<FormAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAddressComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          FormsModule,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
          IonicStorageModule.forRoot(),
      ],
      providers: [
          {provide: Router},
          {provide: AngularFirestore}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("submit worked", () => {
    let result = component.submit();
    expect(Array.isArray(result)).toBeTruthy;
  });

  // it("scan qrcode worked", () => {
  //   let result = component.scanQRCode();
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
  it("init worked", () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
