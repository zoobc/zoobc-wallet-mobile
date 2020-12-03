import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginBackupPage } from './login-backup.page';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Location} from '@angular/common';
import {UrlSerializer} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule} from '@ionic/storage';

describe('LoginBackup Page', () => {
  let component: LoginBackupPage;
  let fixture: ComponentFixture<LoginBackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBackupPage ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        IonicStorageModule.forRoot()
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[
          {provide: Location},
          {provide: UrlSerializer},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBackupPage);
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
//   it("login user worked", () => {
//     let result = component.loginUser(1);
//     expect(Array.isArray(result)).toBeTruthy;
//   });
//   it("go to register page worked", () => {
//     let result = component.goToRegisterPage();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
});
