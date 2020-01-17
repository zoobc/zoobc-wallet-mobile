import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDashboardPage } from './tab-dashboard.page';

describe('TabDashboardPage', () => {
  let component: TabDashboardPage;
  let fixture: ComponentFixture<TabDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabDashboardPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
