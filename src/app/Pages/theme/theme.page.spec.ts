import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemePage } from './theme.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';

describe('ThemePage', () => {
  let component: ThemePage;
  let fixture: ComponentFixture<ThemePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
          TranslateModule.forRoot(),
          RouterTestingModule,
          IonicStorageModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePage);
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
    it("select theme worked", () => {
    let result = component.selectTheme("1");
    expect(Array.isArray(result)).toBeTruthy;
  });
});
