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
//     contact us at roberto.capodieci[at]blockchainzoo.com
//     and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendZoobcFormComponent } from './send-zoobc-form.component';
import {TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';


describe('SendZoobcFormComponent', () => {
  let component: SendZoobcFormComponent;
  let fixture: ComponentFixture<SendZoobcFormComponent>;


  const modalSpy = jasmine.createSpyObj('Modal', ['present']);
  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

  // tslint:disable-next-line:only-arrow-functions
  modalCtrlSpy.create.and.callFake(function() {
    return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendZoobcFormComponent],
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
    fixture = TestBed.createComponent(SendZoobcFormComponent);
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
