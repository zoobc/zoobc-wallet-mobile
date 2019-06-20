import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSendPage } from './tab-send.page';

describe('Tab4Page', () => {
  let component: TabSendPage;
  let fixture: ComponentFixture<TabSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabSendPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
