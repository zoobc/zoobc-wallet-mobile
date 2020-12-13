import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRemoveAccountDatasetComponent } from './form-remove-account-dataset.component';

describe('FormRemoveAccountDatasetComponent', () => {
  let component: FormRemoveAccountDatasetComponent;
  let fixture: ComponentFixture<FormRemoveAccountDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRemoveAccountDatasetComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRemoveAccountDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
