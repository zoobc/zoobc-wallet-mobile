import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectwalletPage } from './selectwallet.page';

describe('SelectwalletPage', () => {
  let component: SelectwalletPage;
  let fixture: ComponentFixture<SelectwalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectwalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectwalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
