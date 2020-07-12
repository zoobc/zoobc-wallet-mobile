import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanqrForAddressbookPage } from './scanqr-for-addressbook.page';

describe('ScanqrForAddressbookPage', () => {
  let component: ScanqrForAddressbookPage;
  let fixture: ComponentFixture<ScanqrForAddressbookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanqrForAddressbookPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanqrForAddressbookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
