import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsPage } from './transactions.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Network } from '@ionic-native/network/ngx';

describe('Transactiona Page', () => {
  let component: TransactionsPage;
  let fixture: ComponentFixture<TransactionsPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        HttpClientModule
        ],
      providers:[
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        { provide: AngularFirestore },
        { provide: Network},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsPage);
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
  it("refresh worked", () => {
    let result = component.doRefresh(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("load detail transaction worked", () => {
    let result = component.loadDetailTransaction(1,"ready");
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("open detail transaction worked", () => {
    let result = component.openDetailTransction(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("load more data worked", () => {
    let result = component.loadMoreData(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get all account worked", () => {
    let result = component.getAllAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get all address worked", () => {
    let result = component.getAllAddress();
    expect(Array.isArray(result)).toBeTruthy;
  });

});