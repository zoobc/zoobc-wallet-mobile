import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendcoinPage } from './sendcoin.page';

describe('SendcoinPage', () => {
  let component: SendcoinPage;
  let fixture: ComponentFixture<SendcoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendcoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendcoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
