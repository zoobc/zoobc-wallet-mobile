import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFeeComponent } from './form-fee.component';

describe('FormFeeComponent', () => {
  let component: FormFeeComponent;
  let fixture: ComponentFixture<FormFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFeeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
