import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

<<<<<<< HEAD:src/app/Pages/send-coin/send-coin.page.spec.ts
import { SendCoinPage } from './send-coin.page';

describe('Tab4Page', () => {
  let component: SendCoinPage;
  let fixture: ComponentFixture<SendCoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendCoinPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
=======
import { TabSendPage } from "./tab-send.page";

describe("TabSendPage", () => {
  let component: TabSendPage;
  let fixture: ComponentFixture<TabSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabSendPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
>>>>>>> 6238c45f96fc4bae2649c7e0732f0d4889d420ae:src/app/Pages/main/tab-send/tab-send.page.spec.ts
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
