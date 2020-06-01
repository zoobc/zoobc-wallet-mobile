import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupPhrasePage } from './backup-phrase.page';

describe('BackupPhrasePage', () => {
  let component: BackupPhrasePage;
  let fixture: ComponentFixture<BackupPhrasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ BackupPhrasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(BackupPhrasePage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
