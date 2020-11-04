import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatProfilePage } from './chat-profile.page';
import {TranslateModule } from '@ngx-translate/core';

// describe('Chat Profile Page', () => {
//   let component: ChatProfilePage;
//   let fixture: ComponentFixture<ChatProfilePage>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ChatProfilePage ],
//       imports: [
//         TranslateModule.forRoot(),
//         ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ChatProfilePage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it("should return a non empty array", () => {
//     let result = component.ngOnInit();
//     expect(Array.isArray(result)).toBeTruthy;
//   });
// });
