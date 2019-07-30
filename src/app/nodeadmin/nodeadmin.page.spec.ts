import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeadminPage } from './nodeadmin.page';

describe('NodeadminPage', () => {
  let component: NodeadminPage;
  let fixture: ComponentFixture<NodeadminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeadminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
