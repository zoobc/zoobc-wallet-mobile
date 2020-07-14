import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSessionPage } from './chat-session.page';

describe('ChatSessionPage', () => {
  let component: ChatSessionPage;
  let fixture: ComponentFixture<ChatSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ ChatSessionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(ChatSessionPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
