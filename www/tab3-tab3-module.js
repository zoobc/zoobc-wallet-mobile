(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tab3-tab3-module"],{

/***/ "./src/app/tab3/tab3.module.ts":
/*!*************************************!*\
  !*** ./src/app/tab3/tab3.module.ts ***!
  \*************************************/
/*! exports provided: Tab3PageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tab3PageModule", function() { return Tab3PageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _tab3_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tab3.page */ "./src/app/tab3/tab3.page.ts");







var Tab3PageModule = /** @class */ (function () {
    function Tab3PageModule() {
    }
    Tab3PageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [
                _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{ path: '', component: _tab3_page__WEBPACK_IMPORTED_MODULE_6__["Tab3Page"] }])
            ],
            declarations: [_tab3_page__WEBPACK_IMPORTED_MODULE_6__["Tab3Page"]]
        })
    ], Tab3PageModule);
    return Tab3PageModule;
}());



/***/ }),

/***/ "./src/app/tab3/tab3.page.html":
/*!*************************************!*\
  !*** ./src/app/tab3/tab3.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar>\n    <ion-buttons start>\n      <ion-button icon-only color=\"royal\">\n        <ion-icon name=\"search\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n    <ion-title>Send To...</ion-title>\n    <ion-buttons end>\n      <ion-button ion-button icon-only color=\"royal\">\n        <ion-icon name=\"person-add\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n<ion-content>\n\n\n\n    <ion-card>\n      <ion-card-header>\n        <ion-card-subtitle>Card Subtitle</ion-card-subtitle>\n        <ion-card-title>Card Title</ion-card-title>\n      </ion-card-header>\n\n      <ion-card-content>\n        Keep close to Nature's heart... and break clear away, once in awhile,\n        and climb a mountain or spend a week in the woods. Wash your spirit clean.\n\n        <ion-list>\n          <ion-item>\n            <ion-icon name=\"leaf\" item-start></ion-icon>\n              Herbology\n          </ion-item>\n        </ion-list>\n      </ion-card-content>\n    </ion-card>\n\n    <ion-card>\n      <ion-item>\n        <ion-icon name=\"pin\" slot=\"start\"></ion-icon>\n        <ion-label>ion-item in a card, icon left, button right</ion-label>\n        <ion-button fill=\"outline\" slot=\"end\">View</ion-button>\n      </ion-item>\n\n      <ion-card-content>\n        This is content, without any paragraph or header tags,\n        within an ion-card-content element.\n      </ion-card-content>\n    </ion-card>\n\n    <ion-card>\n      <ion-item href=\"#\" class=\"activated\">\n        <ion-icon name=\"wifi\" slot=\"start\"></ion-icon>\n        <ion-label>Card Link Item 1 .activated</ion-label>\n      </ion-item>\n\n      <ion-item href=\"#\">\n        <ion-icon name=\"wine\" slot=\"start\"></ion-icon>\n        <ion-label>Card Link Item 2</ion-label>\n      </ion-item>\n\n      <ion-item class=\"activated\">\n        <ion-icon name=\"warning\" slot=\"start\"></ion-icon>\n        <ion-label>Card Button Item 1 .activated</ion-label>\n      </ion-item>\n\n      <ion-item>\n        <ion-icon name=\"walk\" slot=\"start\"></ion-icon>\n        <ion-label>Card Button Item 2</ion-label>\n      </ion-item>\n    </ion-card>\n\n</ion-content>\n"

/***/ }),

/***/ "./src/app/tab3/tab3.page.scss":
/*!*************************************!*\
  !*** ./src/app/tab3/tab3.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RhYjMvdGFiMy5wYWdlLnNjc3MifQ== */"

/***/ }),

/***/ "./src/app/tab3/tab3.page.ts":
/*!***********************************!*\
  !*** ./src/app/tab3/tab3.page.ts ***!
  \***********************************/
/*! exports provided: Tab3Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tab3Page", function() { return Tab3Page; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var Tab3Page = /** @class */ (function () {
    function Tab3Page() {
    }
    Tab3Page = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tab3',
            template: __webpack_require__(/*! ./tab3.page.html */ "./src/app/tab3/tab3.page.html"),
            styles: [__webpack_require__(/*! ./tab3.page.scss */ "./src/app/tab3/tab3.page.scss")]
        })
    ], Tab3Page);
    return Tab3Page;
}());



/***/ })

}]);
//# sourceMappingURL=tab3-tab3-module.js.map