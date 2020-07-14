import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackuprestoreAddressPage } from './backuprestore-address.page';
import { IonicStorageModule, Storage } from '@ionic/storage';

describe('BackuprestoreAddressPage', () => {
  let component: BackuprestoreAddressPage;
  let fixture: ComponentFixture<BackuprestoreAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ BackuprestoreAddressPage ],
      // schemas: [CUSTOM_ELEMENTS_SCHEMA],
      // imports: [IonicStorageModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(BackuprestoreAddressPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
