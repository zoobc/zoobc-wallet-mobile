import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccMultisigInfoPage } from './acc-multisig-info.page';

describe('AccMultisigInfoPage', () => {
  let component: AccMultisigInfoPage;
  let fixture: ComponentFixture<AccMultisigInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccMultisigInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccMultisigInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
