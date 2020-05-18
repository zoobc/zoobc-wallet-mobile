import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplistPage } from './applist.page';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ApplistPage', () => {
  let component: ApplistPage;
  let fixture: ComponentFixture<ApplistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        })
      ],
      providers: [TranslateService, HttpClient, HttpHandler]
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
});
