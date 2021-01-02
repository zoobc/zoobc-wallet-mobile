import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplistPage } from './applist.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplistPage', () => {
  let component: ApplistPage;
  let fixture: ComponentFixture<ApplistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init worked', () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('show sell app worked', () => {
    let result = component.showSellApp();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('show list other app worked', () => {
    let result = component.showListOtherApp();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
});
