import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPopupPage } from './account-popup.page';

describe('AccountPopupPage', () => {
  let component: AccountPopupPage;
  let fixture: ComponentFixture<AccountPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
