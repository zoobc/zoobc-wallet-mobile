import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalListAccountComponent } from "./modal-list-account.component";

describe("ModalListAccountComponent", () => {
  let component: ModalListAccountComponent;
  let fixture: ComponentFixture<ModalListAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalListAccountComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
