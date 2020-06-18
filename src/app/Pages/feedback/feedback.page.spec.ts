import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackPage } from './feedback.page';
import { TranslateModule } from "@ngx-translate/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AngularFirestore },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("should return a non empty array", () => {
    let result = component.showConfirmationSuccess();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
