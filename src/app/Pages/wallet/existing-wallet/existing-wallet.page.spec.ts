import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExistingWalletPage } from './existing-wallet.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { sign as naclSign } from 'tweetnacl';
import { ModalController} from '@ionic/angular';

describe('ExistingWalletPage', () => {
  let component: ExistingWalletPage;
  let fixture: ComponentFixture<ExistingWalletPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingWalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot()
      ],
      providers:[
        { provide: 'global', useFactory: () => '' },
        { provide: 'nacl.sign', useFactory: () => naclSign },
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
