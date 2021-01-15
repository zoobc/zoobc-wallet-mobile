// Copyright 2021 putukusuma
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorEscrowFormComponent } from './behavior-escrow-form.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BehaviorEscrowFormComponent', () => {
  let component: BehaviorEscrowFormComponent;
  let fixture: ComponentFixture<BehaviorEscrowFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BehaviorEscrowFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[
          TranslateModule.forRoot(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorEscrowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init worked', () => {
    const result = component.ngOnInit();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
  it('get block height worked', () => {
    let result = component.getBlockHeight();
    expect(Array.isArray(result)).toBeTruthy;
  });

  
});
