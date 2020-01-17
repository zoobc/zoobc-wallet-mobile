import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalFormAccountComponent } from "./modal-form-account.component";

describe("ModalFormAccountComponent", () => {
  let component: ModalFormAccountComponent;
  let fixture: ComponentFixture<ModalFormAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFormAccountComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
