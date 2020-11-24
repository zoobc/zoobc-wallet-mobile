import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectPage } from './blockchain-object.page';
import {TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { RouterTestingModule } from '@angular/router/testing';
import { PopoverController } from '@ionic/angular';

export const firebaseConfig = {
    apiKey: 'put-firebase',
    authDomain: '',
    databaseURL: '',
    projectId: 'mydatabaseid-XXXX',
    storageBucket: '',
    messagingSenderId: ''
  }


  let popoverSpy = jasmine.createSpyObj('Popover', ['present']);
let popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['create']);

  
describe('BlockchainObjectPage', () => {
  let component: BlockchainObjectPage;
  let fixture: ComponentFixture<BlockchainObjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainObjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
        AngularFirestoreModule,
        RouterTestingModule,
      ],
      providers: [
        {
            provide: PopoverController,
            useValue: popoverCtrlSpy
          },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainObjectPage);
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
  it("translate lang worked", () => {
    let result = component.translateLang();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("create blockchain object worked", () => {
    let result = component.createBlockchainObject();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("show option worked", () => {
    let result = component.showOption(1,1);
    expect(Array.isArray(result)).toBeTruthy;
  });
});
