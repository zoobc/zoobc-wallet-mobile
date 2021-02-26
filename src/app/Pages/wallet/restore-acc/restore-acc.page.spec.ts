import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreAccPage } from './restore-acc.page';

describe('RestoreAccPage', () => {
  let component: RestoreAccPage;
  let fixture: ComponentFixture<RestoreAccPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestoreAccPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreAccPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
