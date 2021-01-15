// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsPage } from './transactions.page';
import {TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from "@angular/router/testing";
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Network } from '@ionic-native/network/ngx';

describe('Transactiona Page', () => {
  let component: TransactionsPage;
  let fixture: ComponentFixture<TransactionsPage>;

  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  modalCtrlSpy.create.and.callFake(function () {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        HttpClientModule
        ],
      providers:[
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
        { provide: AngularFirestore },
        { provide: Network},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsPage);
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
  it("refresh worked", () => {
    let result = component.doRefresh(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("load detail transaction worked", () => {
    let result = component.loadDetailTransaction(1,"ready");
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("open detail transaction worked", () => {
    let result = component.openDetailTransction(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("load more data worked", () => {
    let result = component.loadMoreData(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get all account worked", () => {
    let result = component.getAllAccount();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get all address worked", () => {
    let result = component.getAllAddress();
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("go to transaction detail worked", () => {
    let result = component.goToTransactionDetail(1);
    expect(Array.isArray(result)).toBeTruthy;
  });
  it("get name worked", () => {
    let result = component.getName("BCZ-12345");
    expect(Array.isArray(result)).toBeTruthy;
  });

  // it("get escrow transaction worked", () => {
  //   let result = component.getEscrowTransaction();
  //   expect(Array.isArray(result)).toBeTruthy;
  // });

});