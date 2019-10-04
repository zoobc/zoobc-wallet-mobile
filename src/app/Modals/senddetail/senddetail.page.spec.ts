import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenddetailPage } from './senddetail.page';

describe('SenddetailPage', () => {
  let component: SenddetailPage;
  let fixture: ComponentFixture<SenddetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenddetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenddetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
