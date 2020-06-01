import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPinGpPage } from './setup-pin-gp.page';

describe('SetupPinGpPage', () => {
  let component: SetupPinGpPage;
  let fixture: ComponentFixture<SetupPinGpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ SetupPinGpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SetupPinGpPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
