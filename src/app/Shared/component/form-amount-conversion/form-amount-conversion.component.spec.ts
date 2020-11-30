import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAmountConversionComponent } from './form-amount-conversion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';

describe('FormAmountConversionComponent', () => {
  let component: FormAmountConversionComponent;
  let fixture: ComponentFixture<FormAmountConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAmountConversionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          FormsModule,
          ReactiveFormsModule,
          HttpClientModule,
          IonicStorageModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAmountConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("init worked", () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });
  
});
