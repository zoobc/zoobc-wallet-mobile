import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingWalletPage } from './existing-wallet.page';

describe('ExistingWalletPage', () => {
  let component: ExistingWalletPage;
  let fixture: ComponentFixture<ExistingWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingWalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
