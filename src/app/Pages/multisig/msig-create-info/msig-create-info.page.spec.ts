import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsigCreateInfoPage } from './msig-create-info.page';

describe('MsigCreateInfoPage', () => {
  let component: MsigCreateInfoPage;
  let fixture: ComponentFixture<MsigCreateInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsigCreateInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsigCreateInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
