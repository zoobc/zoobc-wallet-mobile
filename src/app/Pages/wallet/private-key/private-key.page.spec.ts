import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateKeyPage } from './private-key.page';

describe('PrivateKeyPage', () => {
  let component: PrivateKeyPage;
  let fixture: ComponentFixture<PrivateKeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateKeyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
