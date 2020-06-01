import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatProfilePage } from './chat-profile.page';

describe('ChatProfilePage', () => {
  let component: ChatProfilePage;
  let fixture: ComponentFixture<ChatProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ ChatProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(ChatProfilePage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
