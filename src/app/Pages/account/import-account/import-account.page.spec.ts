import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportAccountPage } from './import-account.page';
import { IonicStorageModule } from '@ionic/storage';
import { ModalController} from '@ionic/angular';
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

describe('ImportAccountPage', () => {
  let component: ImportAccountPage;
  let fixture: ComponentFixture<ImportAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
          IonicStorageModule.forRoot()
      ],
      providers:[
        {
            provide: ModalController,
            useValue: modalCtrlSpy
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAccountPage);
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
  
  it("import text worked", () => {
    let result = component.importText();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it("saved account worked", () => {
    let result = component.isSavedAccount(account);
    expect(Array.isArray(result)).toBeTruthy;
  });
});
