import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupCurrencyPage } from './popup-currency.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

describe('PopupCurrencyPage', () => {
  let component: PopupCurrencyPage;
  let fixture: ComponentFixture<PopupCurrencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupCurrencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          TranslateModule.forRoot(),
          RouterTestingModule,
          HttpClientModule,
          IonicStorageModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupCurrencyPage);
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
  it("converlist worked", () => {
    let result = component.convertList();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
