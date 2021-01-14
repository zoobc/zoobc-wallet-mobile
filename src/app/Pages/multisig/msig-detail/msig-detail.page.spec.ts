import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsigDetailPage } from './msig-detail.page';

describe('MsigDetailPage', () => {
  let component: MsigDetailPage;
  let fixture: ComponentFixture<MsigDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsigDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsigDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
