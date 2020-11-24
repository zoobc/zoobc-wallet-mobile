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

  it("init worked worked", () => {
    let result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("show error message worked", () => {
    let result = component.showErrorMessage(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("submit worked", () => {
    let result = component.submit();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("show loading worked", () => {
    let result = component.showLoading();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("set fee validation worked", () => {
    let result = component.setFeeValidation();
    expect(Array.isArray(result)).toBeTruthy;
  });
  // it("set amount validation worked", () => {
  //   let result = component.setAmountValidation();
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
  
});
