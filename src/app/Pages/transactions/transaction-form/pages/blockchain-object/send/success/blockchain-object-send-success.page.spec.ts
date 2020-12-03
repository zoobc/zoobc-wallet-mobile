import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainObjectSendSuccessPage } from './blockchain-object-send-success.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// describe('BlockchainObjectSendSuccessPage', () => {
//   let component: BlockchainObjectSendSuccessPage;
//   let fixture: ComponentFixture<BlockchainObjectSendSuccessPage>;
//   let router: jasmine.SpyObj<Router>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ BlockchainObjectSendSuccessPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//           TranslateModule.forRoot(),
//           RouterTestingModule
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     router = TestBed.get(Router);
//     spyOn(router, 'getCurrentNavigation').and.returnValue({ extras: [{ address: "test"},{ amount: "1" }] } as any);
//     fixture = TestBed.createComponent(BlockchainObjectSendSuccessPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
