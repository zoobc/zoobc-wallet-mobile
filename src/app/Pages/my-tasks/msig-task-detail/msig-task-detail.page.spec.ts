import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsigTaskDetailPage } from './msig-task-detail.page';

describe('MsigTaskDetailPage', () => {
  let component: MsigTaskDetailPage;
  let fixture: ComponentFixture<MsigTaskDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsigTaskDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsigTaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
