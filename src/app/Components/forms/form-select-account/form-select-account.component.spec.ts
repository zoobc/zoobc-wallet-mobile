import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormSelectAccountComponent } from "./form-select-account.component";

describe("FormSelectAccountComponent", () => {
  let component: FormSelectAccountComponent;
  let fixture: ComponentFixture<FormSelectAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormSelectAccountComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
