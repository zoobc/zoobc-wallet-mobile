import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAmountConversionComponent } from './form-amount-conversion.component';

describe('FormAmountConversionComponent', () => {
  let component: FormAmountConversionComponent;
  let fixture: ComponentFixture<FormAmountConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAmountConversionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
});
