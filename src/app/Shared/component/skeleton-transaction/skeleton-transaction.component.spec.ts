import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonTransactionComponent } from './skeleton-transaction.component';

describe('SkeletonTransactionComponent', () => {
  let component: SkeletonTransactionComponent;
  let fixture: ComponentFixture<SkeletonTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonTransactionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
