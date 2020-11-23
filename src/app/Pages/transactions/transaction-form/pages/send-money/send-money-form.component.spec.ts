import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMoneyFormComponent } from './send-money-form.component';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { Network } from '@ionic-native/network/ngx';

export const firebaseConfig = {
  apiKey: 'put-firebase',
  authDomain: '',
  databaseURL: '',
  projectId: 'mydatabaseid-XXXX',
  storageBucket: '',
  messagingSenderId: ''
}

describe('SendMoneyFormComponent', () => {
  let component: SendMoneyFormComponent;
  let fixture: ComponentFixture<SendMoneyFormComponent>;


  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMoneyFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
          TranslateModule.forRoot(),
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          IonicStorageModule.forRoot(),
          AngularFirestoreModule
      ],
      providers: [
        {
            provide: ModalController,
            useValue: modalCtrlSpy
          },
          Network,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
