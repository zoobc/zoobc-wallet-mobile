import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpinsendPage } from './enterpinsend.page';

describe('EnterpinsendPage', () => {
  let component: EnterpinsendPage;
  let fixture: ComponentFixture<EnterpinsendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpinsendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpinsendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
