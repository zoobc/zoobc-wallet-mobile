import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithCopyComponent } from './with-copy.component';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';

let modalSpy = jasmine.createSpyObj('Modal', ['present']);
let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

modalCtrlSpy.create.and.callFake(function () {
  return modalSpy;
});


describe('WithCopyComponent', () => {
  let component: WithCopyComponent;
  let fixture: ComponentFixture<WithCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithCopyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        RouterTestingModule,
      ],
      providers: [
        Clipboard,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it("copy worked", () => {
  //   let result = component.copy(1);
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
});
