import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailPage } from './transaction-detail.page';
import {TranslateModule } from '@ngx-translate/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController, NavParams} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';

describe('Transaction Detail Page', () => {
  let component: TransactionDetailPage;
  let fixture: ComponentFixture<TransactionDetailPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDetailPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        ],
      providers:[
        Clipboard,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        { 
          provide: NavParams, 
          useClass: class { NavParams = jasmine.createSpy("NavParams"); }
        },
        { provide: Network }, 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailPage);
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
  it("ion view did leave worked", () => {
    let result = component.ionViewDidLeave();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
