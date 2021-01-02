import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressBookPage } from './address-book.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import {Location} from '@angular/common';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ModalController, PopoverController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

describe('AddressBookPage', () => {
  let component: AddressBookPage;
  let fixture: ComponentFixture<AddressBookPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  
let popoverSpy = jasmine.createSpyObj('Popover', ['present']);
let popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['create']);

popoverCtrlSpy.create.and.callFake(function () {
    return popoverSpy;
  });

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookPage ],
      imports:[
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot(),
      ],
      providers: [
        Location,
        Clipboard,
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        {
            provide: PopoverController,
            useValue: popoverCtrlSpy
          },
        { provide: AngularFirestore },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("edit address worked", () => {
    let result = component.editAddress(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("delete address worked", () => {
    let result = component.deleteAddress(1);
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("create new address worked", () => {
    let result = component.createNewAddress();
    expect(Array.isArray(result)).toBeTruthy;
  });

  it("select address worked", () => {
    let result = component.selectAddress("BCZ-8311676436487");
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("get all address worked", () => {
    let result = component.getAllAddress();
    expect(Array.isArray(result)).toBeTruthy;
  });


  
  it("translate lang worked", () => {
    let result = component.translateLang();
    expect(Array.isArray(result)).toBeTruthy;
  });


  
});
