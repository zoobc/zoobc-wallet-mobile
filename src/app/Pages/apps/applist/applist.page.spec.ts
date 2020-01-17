import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplistPage } from './applist.page';

describe('ApplistPage', () => {
  let component: ApplistPage;
  let fixture: ComponentFixture<ApplistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
