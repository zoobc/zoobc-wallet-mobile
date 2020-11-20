import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountPage } from './create-account.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { RouterModule } from '@angular/router';
import { ModalController} from '@ionic/angular';


let modalSpy = jasmine.createSpyObj('Modal', ['present']);
let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

describe('CreateAccountPage', () => {
  let component: CreateAccountPage;
  let fixture: ComponentFixture<CreateAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        IonicStorageModule.forRoot(),
        RouterModule.forRoot([]),
      ],
      providers:[
        { provide: 'global', useFactory: () => window },
        {
            provide: ModalController,
            useValue: modalCtrlSpy
          },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
