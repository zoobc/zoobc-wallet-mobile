import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsigAddParticipantsPage } from './msig-add-participants.page';

describe('MsigAddParticipantsPage', () => {
  let component: MsigAddParticipantsPage;
  let fixture: ComponentFixture<MsigAddParticipantsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsigAddParticipantsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsigAddParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
