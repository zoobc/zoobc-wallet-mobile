import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverBlockchainObjectOptionComponent } from './popover-blockchain-object-option.component';

describe('PopoverBlockchainObjectOptionComponent', () => {
  let component: PopoverBlockchainObjectOptionComponent;
  let fixture: ComponentFixture<PopoverBlockchainObjectOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverBlockchainObjectOptionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverBlockchainObjectOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
