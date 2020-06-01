import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinBackupPage } from './pin-backup.page';

describe('PinBackupPage', () => {
  let component: PinBackupPage;
  let fixture: ComponentFixture<PinBackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ PinBackupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(PinBackupPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
