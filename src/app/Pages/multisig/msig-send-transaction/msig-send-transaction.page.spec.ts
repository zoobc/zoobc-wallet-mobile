import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsigSendTransactionPage } from './msig-send-transaction.page';

describe('MsigSendTransactionPage', () => {
  let component: MsigSendTransactionPage;
  let fixture: ComponentFixture<MsigSendTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsigSendTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsigSendTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
