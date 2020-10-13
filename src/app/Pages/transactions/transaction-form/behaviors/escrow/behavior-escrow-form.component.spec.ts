import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorEscrowFormComponent } from './behavior-escrow-form.component';

describe('BehaviorEscrowFormComponent', () => {
  let component: BehaviorEscrowFormComponent;
  let fixture: ComponentFixture<BehaviorEscrowFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BehaviorEscrowFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorEscrowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});