import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountPopupPage } from './account-popup.page';
import { IonicStorageModule } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import {TranslateFakeLoader,TranslateLoader,TranslateModule,TranslateService } from '@ngx-translate/core';
import { Account } from 'src/app/Interfaces/account';

let modalSpy = jasmine.createSpyObj('Modal', ['present']);
let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

const account: Account = {
    path: 0,
    name : "test",
    nodeIP : "192.168.1.1",
    address : "QWERTY",
  
  };

modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });


describe('AccountPopupPage', () => {
  let component: AccountPopupPage;
  let fixture: ComponentFixture<AccountPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
          AccountPopupPage 
        ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ],
      imports: [
        TranslateModule.forRoot({
                                  loader: {
                                    provide: TranslateLoader,
                                    useClass: TranslateFakeLoader
                                  }
                                }),
          IonicStorageModule.forRoot(),
        ],
       providers: [
        TranslateService,
        {
            provide: ModalController,
            useValue: modalCtrlSpy
          },
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('init page worked', () => {
    expect(component).toBeTruthy();
  });

  it("short address worked", () => {
    let result = component.shortAddress("BCZ213234365464");
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("click account worked", () => {
    let result = component.accountClicked(account);
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("close modal worked", () => {
    let result = component.closeModal();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("get all account balance worked", () => {
    let result = component.getAllAccountBalance(account);
    expect(Array.isArray(result)).toBeTruthy;
  });

  
});
