import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverActionComponent } from './popover-action.component';
import { TranslateModule } from "@ngx-translate/core";
import { PopoverController, AngularDelegate } from '@ionic/angular';

describe('PopoverActionComponent', () => {
  let component: PopoverActionComponent;
  let fixture: ComponentFixture<PopoverActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverActionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          TranslateModule.forRoot(),
      ],
      providers:[
          PopoverController,
          AngularDelegate
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverActionComponent);
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
  
  it("dismiss worked", () => {
    let result = component.dismiss("1");
    expect(Array.isArray(result)).toBeTruthy;
  });
});
