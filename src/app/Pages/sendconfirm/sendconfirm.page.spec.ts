import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendconfirmPage } from './sendconfirm.page';

describe('SendconfirmPage', () => {
  let component: SendconfirmPage;
  let fixture: ComponentFixture<SendconfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendconfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendconfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
