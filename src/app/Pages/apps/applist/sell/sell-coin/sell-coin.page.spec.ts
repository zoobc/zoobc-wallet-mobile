import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SellCoinPage } from './sell-coin.page';
import { TranslateModule } from "@ngx-translate/core";

describe('SellCoinPage', () => {
  let component: SellCoinPage;
  let fixture: ComponentFixture<SellCoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellCoinPage ],
      imports:[
        TranslateModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellCoinPage);
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
});
