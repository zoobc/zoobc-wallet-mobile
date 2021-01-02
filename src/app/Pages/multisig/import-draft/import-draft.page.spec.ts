import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDraftPage } from './import-draft.page';

describe('ImportDraftPage', () => {
  let component: ImportDraftPage;
  let fixture: ComponentFixture<ImportDraftPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDraftPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDraftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
