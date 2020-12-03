import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormObjectComponent } from './form-object.component';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from '@angular/forms'

describe('FormObjectComponent', () => {
  let component: FormObjectComponent;
  let fixture: ComponentFixture<FormObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormObjectComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        FormsModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormObjectComponent);
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
  it("change value worked", () => {
    let result = component.changeValue();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
