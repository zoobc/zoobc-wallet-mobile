import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegBackupPage } from './reg-backup.page';

describe('RegBackupPage', () => {
  let component: RegBackupPage;
  let fixture: ComponentFixture<RegBackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegBackupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegBackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
