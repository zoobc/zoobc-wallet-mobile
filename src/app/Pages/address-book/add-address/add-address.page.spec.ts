import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddressPage } from './add-address.page';
import { TranslateModule } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from "@angular/router/testing";

describe('AddAddressPage', () => {
  let component: AddAddressPage;
  let fixture: ComponentFixture<AddAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddressPage ],
      imports: [
        TranslateModule.forRoot(),
        IonicStorageModule.forRoot(),
        RouterTestingModule
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFirestore },
      ],
    })
    .compileComponents();

    component = new AddAddressPage(null, null);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("submit worked", () => {
    let result = component.onSubmit(1111);
    expect(Array.isArray(result)).toBeTruthy;
  });

});
