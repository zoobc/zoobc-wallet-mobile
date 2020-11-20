import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGetObjectComponent } from './form-get-object.component';

describe('FormGetObjectComponent', () => {
  let component: FormGetObjectComponent;
  let fixture: ComponentFixture<FormGetObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGetObjectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGetObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
