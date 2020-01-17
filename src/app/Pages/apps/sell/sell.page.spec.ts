import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppSellPage } from "./sell.page";

describe("AppSellPage", () => {
  let component: AppSellPage;
  let fixture: ComponentFixture<AppSellPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppSellPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
