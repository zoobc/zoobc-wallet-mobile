import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverOptionComponent } from './popover-option.component';
import { PopoverController } from '@ionic/angular';


let popoverSpy = jasmine.createSpyObj('Popover', ['present']);
let popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['create']);

popoverCtrlSpy.create.and.callFake(function () {
    return popoverSpy;
  });

describe('PopoverOptionComponent', () => {
  let component: PopoverOptionComponent;
  let fixture: ComponentFixture<PopoverOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverOptionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[
        {
            provide: PopoverController,
            useValue: popoverCtrlSpy
          },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverOptionComponent);
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
//   it("dismiss worked", () => {
//     let result = component.dismiss("1");
//     expect(Array.isArray(result)).toBeTruthy;
//   });
});
