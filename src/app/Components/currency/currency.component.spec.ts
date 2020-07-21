import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyComponent } from './currency.component';
import {TranslateModule } from '@ngx-translate/core';
import { ModalController} from '@ionic/angular';

describe('Currency Component', () => {
  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;

    let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyComponent ],
      imports: [
        TranslateModule.forRoot(),
        ],
      providers:[
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
