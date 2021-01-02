import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetAccountPage } from './dataset-account.page';

describe('DatasetAccountPage', () => {
  let component: DatasetAccountPage;
  let fixture: ComponentFixture<DatasetAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
