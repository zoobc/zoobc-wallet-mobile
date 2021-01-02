import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectPage } from './blockchain-object.page';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { RouterTestingModule } from '@angular/router/testing';
import { PopoverController } from '@ionic/angular';

const popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['create']);


describe('BlockchainObjectPage', () => {
  let component: BlockchainObjectPage;
  let fixture: ComponentFixture<BlockchainObjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockchainObjectPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
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
  it('init worked', () => {
    const result = component.ngOnInit();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('translate lang worked', () => {
    const result = component.translateLang();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('create blockchain object worked', () => {
    const result = component.createBlockchainObject();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('show option worked', () => {
    const result = component.showOption(1, 1);
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
});
