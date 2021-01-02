import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectCreatePage } from './blockchain-object-create.page';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';

describe('BlockchainObjectCreatePage', () => {
  let component: BlockchainObjectCreatePage;
  let fixture: ComponentFixture<BlockchainObjectCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainObjectCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        IonicStorageModule.forRoot(),
        RouterTestingModule,
      ],
      providers:[
        {
            provide: AngularFirestore
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainObjectCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("init worked", () => {
    let result = component.ngOnInit();
    expect(result).toBeTruthy;
  });

  it("submit worked", () => {
    let result = component.onSubmit();
    expect(result).toBeTruthy;
  });

  it("remove object item worked", () => {
    let result = component.removeObjectItem(1);
    expect(result).toBeTruthy;
  });

  it("translate lang worked", () => {
    let result = component.translateLang();
    expect(result).toBeTruthy;
  });
});
