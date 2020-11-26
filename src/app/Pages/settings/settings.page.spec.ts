import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import {TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from "@angular/router/testing";

describe('Settings Page', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPage ],
      imports: [
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
        HttpClientModule,
        RouterModule,
        RouterTestingModule,
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
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
  it("translate lang worked", () => {
    let result = component.translateLang();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("go to network worked", () => {
    let result = component.goToNetwork();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("go to language worked", () => {
    let result = component.goToLanguage();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("go to seed phrase worked", () => {
    let result = component.goToSeedPhrase();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("go to help and support worked", () => {
    let result = component.goToHelpAndSupport();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get currency rates worked", () => {
    let result = component.getCurrencyRates();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
