import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoAmountConversionComponent } from './info-amount-conversion.component';

describe('InfoAmountConversionComponent', () => {
  let component: InfoAmountConversionComponent;
  let fixture: ComponentFixture<InfoAmountConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoAmountConversionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAmountConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
