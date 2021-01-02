import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPinGpPage } from './setup-pin-gp.page';
import {TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { RouterTestingModule } from '@angular/router/testing';

describe('Notifications Page', () => {
  let component: SetupPinGpPage;
  let fixture: ComponentFixture<SetupPinGpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupPinGpPage ],
      imports: [
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
        RouterTestingModule
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPinGpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
//   it("init worked", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
  it("setup pin worked", () => {
    let result = component.setupPin(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("confirm pin worked", () => {
    let result = component.confirmPin(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

});