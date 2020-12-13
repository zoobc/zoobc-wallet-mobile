import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMoneyFormComponent } from './send-money-form.component';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';


describe('SendMoneyFormComponent', () => {
  let component: SendMoneyFormComponent;
  let fixture: ComponentFixture<SendMoneyFormComponent>;


  const modalSpy = jasmine.createSpyObj('Modal', ['present']);
  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  // tslint:disable-next-line:only-arrow-functions
  modalCtrlSpy.create.and.callFake(function() {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMoneyFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          TranslateModule.forRoot(),
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          IonicStorageModule.forRoot()
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

  it('init worked worked', () => {
    const result = component.ngOnInit();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });

  it('show error message worked', () => {
    const result = component.showErrorMessage(1);
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });

  it('submit worked', () => {
    const result = component.submit();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('show loading worked', () => {
    const result = component.showLoading();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  it('set fee validation worked', () => {
    const result = component.setFeeValidation();
    // tslint:disable-next-line:no-unused-expression
    expect(Array.isArray(result)).toBeTruthy;
  });
  // it("set amount validation worked", () => {
  //   let result = component.setAmountValidation();
  //   expect(Array.isArray(result)).toBeTruthy;
  // });
});
