import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAccountComponent } from './list-account.component';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from '@angular/router';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController,PopoverController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Account } from 'src/app/Interfaces/account';

let modalSpy = jasmine.createSpyObj('Modal', ['present']);
let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);


let popoverSpy = jasmine.createSpyObj('Popover', ['present']);
let popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['create']);

const account: Account = {
  path: 0,
  name : "test",
  nodeIP : "192.168.1.1",
  address : "QWERTY",

};

modalCtrlSpy.create.and.callFake(function () {
  return modalSpy;
});

popoverCtrlSpy.create.and.callFake(function () {
  return popoverSpy;
});


describe('ListAccountComponent', () => {
  let component: ListAccountComponent;
  let fixture: ComponentFixture<ListAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAccountComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        IonicStorageModule.forRoot()
      ],
      providers:[
        Clipboard,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        {
          provide: PopoverController,
          useValue: popoverCtrlSpy
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('init page worked', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("scan qrcode worked", () => {
    let result = component.scanQrCode();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("create new acc worked", () => {
    let result = component.createNewAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("load data worked", () => {
    let result = component.loadData();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("translate lang worked", () => {
    let result = component.translateLang();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("view acc worked", () => {
    let result = component.viewAccount(account);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get all acc balance worked", () => {
    let result = component.getAllAccountBalance(account);
    expect(result).toBeTruthy;
  });
});
