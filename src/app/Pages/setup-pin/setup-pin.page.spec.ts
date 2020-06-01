import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPinPage } from './setup-pin.page';

describe('SetupPinPage', () => {
  let component: SetupPinPage;
  let fixture: ComponentFixture<SetupPinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ SetupPinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SetupPinPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
