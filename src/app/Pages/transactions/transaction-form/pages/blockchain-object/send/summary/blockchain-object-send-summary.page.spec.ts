import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainObjectSendSummaryPage } from './blockchain-object-send-summary.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

// describe('BlockchainObjectSendSummaryPage', () => {
//   let component: BlockchainObjectSendSummaryPage;
//   let fixture: ComponentFixture<BlockchainObjectSendSummaryPage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ BlockchainObjectSendSummaryPage ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//       imports:[
//           TranslateModule.forRoot(),
//           RouterModule.forRoot([])
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(BlockchainObjectSendSummaryPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });