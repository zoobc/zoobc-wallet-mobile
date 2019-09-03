import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalAddressBookComponent } from "./modal-address-book.component";

describe("ModalAddressBookComponent", () => {
  let component: ModalAddressBookComponent;
  let fixture: ComponentFixture<ModalAddressBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddressBookComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddressBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
