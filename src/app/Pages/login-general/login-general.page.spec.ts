import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGeneralPage } from './login-general.page';

describe('LoginGeneralPage', () => {
  let component: LoginGeneralPage;
  let fixture: ComponentFixture<LoginGeneralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginGeneralPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginGeneralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
