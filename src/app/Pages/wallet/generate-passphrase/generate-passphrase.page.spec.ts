import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePassphrasePage } from './generate-passphrase.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { sign as naclSign } from 'tweetnacl';

describe('Generate Passphrase Page', () => {
  let component: GeneratePassphrasePage;
  let fixture: ComponentFixture<GeneratePassphrasePage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePassphrasePage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot()
        ],
      providers:[
        Clipboard,
        { provide: 'global', useFactory: () => '' },
        { provide: 'nacl.sign', useFactory: () => naclSign },
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
    fixture = TestBed.createComponent(GeneratePassphrasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("passphrase confirmation worked", () => {
    let result = component.passphraseConfirmation();
    expect(Array.isArray(result)).toBeTruthy;
  });
  // it("init worked", () => {
  //   let result = component.ngOnInit();
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
  // it("setup pin worked", () => {
  //   let result = component.setupPin(1);
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
  // it("on change language worked", () => {
  //   let result = component.onLanguageChanged("ID");
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
});
