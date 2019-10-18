import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabReceivePage } from './tab-receive.page';

describe('TabReceivePage', () => {
  let component: TabReceivePage;
  let fixture: ComponentFixture<TabReceivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabReceivePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabReceivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
