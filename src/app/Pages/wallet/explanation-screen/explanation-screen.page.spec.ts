import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationScreenPage } from './explanation-screen.page';

describe('ExplanationScreenPage', () => {
  let component: ExplanationScreenPage;
  let fixture: ComponentFixture<ExplanationScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplanationScreenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplanationScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
