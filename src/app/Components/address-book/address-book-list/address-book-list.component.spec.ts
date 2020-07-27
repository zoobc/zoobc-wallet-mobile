import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressBookListComponent } from './address-book-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import {TranslateFakeLoader,TranslateLoader,TranslateModule,TranslateService } from '@ngx-translate/core';


describe('AddressBookListComponent', () => {
  let component: AddressBookListComponent;
  let fixture: ComponentFixture<AddressBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot({
                      loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                      }
                    }),
          RouterTestingModule,
          IonicStorageModule.forRoot(),
        ],
        providers:[
            TranslateService,
            { provide: AngularFirestore },
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookListComponent);
    component = fixture.componentInstance;  
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should return a non empty array", () => {
    let result = component.getAllAddress();
    expect(Array.isArray(result)).toBeTruthy;
  });
});
