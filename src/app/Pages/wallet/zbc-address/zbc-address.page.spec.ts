import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZbcAddressPage } from './zbc-address.page';

describe('ZbcAddressPage', () => {
  let component: ZbcAddressPage;
  let fixture: ComponentFixture<ZbcAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZbcAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZbcAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
