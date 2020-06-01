import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCoinPage } from './send-coin.page';

describe('Tab4Page', () => {
  let component: SendCoinPage;
  let fixture: ComponentFixture<SendCoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [SendCoinPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(SendCoinPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
