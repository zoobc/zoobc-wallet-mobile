import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectCreateSuccessPage } from './blockchain-object-create-success.page';
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BlockchainObjectCreateSuccessPage', () => {
  let component: BlockchainObjectCreateSuccessPage;
  let fixture: ComponentFixture<BlockchainObjectCreateSuccessPage>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockchainObjectCreateSuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
          TranslateModule.forRoot(),
          RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({ extras: [{ address: "test"},{ amount: "1" }] } as any);
    fixture = TestBed.createComponent(BlockchainObjectCreateSuccessPage);
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
  
});
