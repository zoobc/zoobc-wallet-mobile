import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCoinPage } from './send-coin.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Clipboard } from '@ionic-native/clipboard/ngx';

describe('Send Coin Page', () => {
  let component: SendCoinPage;
  let fixture: ComponentFixture<SendCoinPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCoinPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        HttpClientModule,
        ],
        providers:[
          Clipboard,
          {
            provide: ModalController,
            useValue: modalCtrlSpy
          },
          { provide: AngularFirestore },
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});