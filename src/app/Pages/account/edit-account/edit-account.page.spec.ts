import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountPage } from './edit-account.page';

describe('EditAccountPage', () => {
  let component: EditAccountPage;
  let fixture: ComponentFixture<EditAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
