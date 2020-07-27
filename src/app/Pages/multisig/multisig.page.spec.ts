import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MultisigPage } from './multisig.page';

describe('MultisigPage', () => {
  let component: MultisigPage;
  let fixture: ComponentFixture<MultisigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultisigPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
