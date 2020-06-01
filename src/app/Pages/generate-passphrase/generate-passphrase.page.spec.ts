import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePassphrasePage } from './generate-passphrase.page';

describe('GeneratePassphrasePage', () => {
  let component: GeneratePassphrasePage;
  let fixture: ComponentFixture<GeneratePassphrasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ GeneratePassphrasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(GeneratePassphrasePage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
