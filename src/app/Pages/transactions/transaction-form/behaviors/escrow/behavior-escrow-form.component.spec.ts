import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorEscrowFormComponent } from './behavior-escrow-form.component';
import { TranslateModule } from "@ngx-translate/core";

describe('BehaviorEscrowFormComponent', () => {
  let component: BehaviorEscrowFormComponent;
  let fixture: ComponentFixture<BehaviorEscrowFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BehaviorEscrowFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
          TranslateModule.forRoot(),
      ]
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

  
  it("init worked", () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("get block height worked", () => {
    let result = component.getBlockHeight();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
});
