import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowHistoryPage } from './escrow-history.page';

describe('EscrowHistoryPage', () => {
  let component: EscrowHistoryPage;
  let fixture: ComponentFixture<EscrowHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
