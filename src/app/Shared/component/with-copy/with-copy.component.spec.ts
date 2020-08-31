import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithCopyComponent } from './with-copy.component';

describe('WithCopyComponent', () => {
  let component: WithCopyComponent;
  let fixture: ComponentFixture<WithCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithCopyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
