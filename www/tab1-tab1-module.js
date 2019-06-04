(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["tab1-tab1-module"],{

/***/ "./src/app/tab1/tab1.module.ts":
/*!*************************************!*\
  !*** ./src/app/tab1/tab1.module.ts ***!
  \*************************************/
/*! exports provided: Tab1PageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tab1PageModule", function() { return Tab1PageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _tab1_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tab1.page */ "./src/app/tab1/tab1.page.ts");







var Tab1PageModule = /** @class */ (function () {
    function Tab1PageModule() {
    }
    Tab1PageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["NgModule"])({
            imports: [
                _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["IonicModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([{ path: '', component: _tab1_page__WEBPACK_IMPORTED_MODULE_6__["Tab1Page"] }])
            ],
            declarations: [_tab1_page__WEBPACK_IMPORTED_MODULE_6__["Tab1Page"]]
        })
    ], Tab1PageModule);
    return Tab1PageModule;
}());



/***/ }),

/***/ "./src/app/tab1/tab1.page.html":
/*!*************************************!*\
  !*** ./src/app/tab1/tab1.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header>\n  <ion-toolbar color=\"primary\">\n      <ion-title>Spinechain</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-grid>\n    <ion-row>\n      <ion-col col-6>\n        <ion-button shape=\"round\" [routerLink]=\"['//tabs/tab2']\" fill=\"outline\" expand=\"full\">Receive</ion-button>\n      </ion-col>\n      <ion-col col-6>\n        <ion-button shape=\"round\" href=\"https://coinmarketcap.com/\" fill=\"outline\" expand=\"full\">Buy SPC cash</ion-button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n\n  <ion-card>\n      <ion-card-header>\n        <ion-card-title>Wallet</ion-card-title>\n      </ion-card-header>\n      <ion-card-content>\n        <ion-item>Available Balance: {{balance['BalanceNQT']}}</ion-item>\n        <ion-item>Pendig Balance: {{balance['UnconfirmedBalanceNQT']}}</ion-item>\n      </ion-card-content>\n  </ion-card>\n    \n  <ion-card>\n      <ion-card-header>\n        <ion-card-title>Recent Transaction</ion-card-title>\n      </ion-card-header>\n      <ion-card-content>\n        <ion-list *ngFor=\"let p of transactions\">\n          <ion-item>\n            <ion-label>Amount: {{p['AmountNQT']}} | Fee: {{p['feeNQT']}}</ion-label>\n          </ion-item>\n        </ion-list>\n      </ion-card-content>\n  </ion-card>   \n\n</ion-content>"

/***/ }),

/***/ "./src/app/tab1/tab1.page.scss":
/*!*************************************!*\
  !*** ./src/app/tab1/tab1.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".welcome-card ion-img {\n  max-height: 35vh;\n  overflow: hidden; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hZ3Vzc3VyeWFudGFyYS9Eb2N1bWVudHMvUHJvamVjdHMvQmxvY2tjaGFpblpvby9tb2JpbGUtd2FsbGV0LWlvbmljL3NyYy9hcHAvdGFiMS90YWIxLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0IsRUFBQSIsImZpbGUiOiJzcmMvYXBwL3RhYjEvdGFiMS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIud2VsY29tZS1jYXJkIGlvbi1pbWcge1xuICBtYXgtaGVpZ2h0OiAzNXZoO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/tab1/tab1.page.ts":
/*!***********************************!*\
  !*** ./src/app/tab1/tab1.page.ts ***!
  \***********************************/
/*! exports provided: Tab1Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tab1Page", function() { return Tab1Page; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _services_balance_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/balance.service */ "./src/services/balance.service.ts");
/* harmony import */ var _services_transaction_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/transaction.service */ "./src/services/transaction.service.ts");





var Tab1Page = /** @class */ (function () {
    function Tab1Page(blnSrv, trxSrv, loadingController) {
        this.blnSrv = blnSrv;
        this.trxSrv = trxSrv;
        this.loadingController = loadingController;
        this.publicKey = 'JkhkUiury9899';
    }
    Tab1Page.prototype.getBalance = function (pKey) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var loading;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Loading'
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        this.blnSrv.getData(pKey)
                            .subscribe(function (res) {
                            console.log(res);
                            _this.data1 = res[0];
                            _this.balance = _this.data1['data'];
                            loading.dismiss();
                        }, function (err) {
                            console.log(err);
                            loading.dismiss();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Tab1Page.prototype.getTransaction = function (pKey) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var loading;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Loading'
                        })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        this.trxSrv.getData(pKey)
                            .subscribe(function (res) {
                            console.log(res);
                            _this.data2 = res[0];
                            _this.transactions = _this.data2['transactions'];
                            loading.dismiss();
                        }, function (err) {
                            console.log(err);
                            loading.dismiss();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Tab1Page.prototype.ngOnInit = function () {
        this.getBalance(this.publicKey);
        this.getTransaction(this.publicKey);
    };
    Tab1Page = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tab1',
            template: __webpack_require__(/*! ./tab1.page.html */ "./src/app/tab1/tab1.page.html"),
            styles: [__webpack_require__(/*! ./tab1.page.scss */ "./src/app/tab1/tab1.page.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_balance_service__WEBPACK_IMPORTED_MODULE_3__["BalanceService"], _services_transaction_service__WEBPACK_IMPORTED_MODULE_4__["TransactionService"], _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["LoadingController"]])
    ], Tab1Page);
    return Tab1Page;
}());



/***/ }),

/***/ "./src/services/balance.service.ts":
/*!*****************************************!*\
  !*** ./src/services/balance.service.ts ***!
  \*****************************************/
/*! exports provided: BalanceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BalanceService", function() { return BalanceService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");





var apiUrl = 'http://54.254.196.180:8000/getBalance/';
var BalanceService = /** @class */ (function () {
    function BalanceService(http) {
        this.http = http;
    }
    BalanceService.prototype.getData = function (pKey) {
        var response1 = this.http.get(apiUrl + pKey);
        // const response2 = this.http.get(apiUrl + 'IN/110001');
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])([response1]);
    };
    BalanceService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], BalanceService);
    return BalanceService;
}());



/***/ }),

/***/ "./src/services/transaction.service.ts":
/*!*********************************************!*\
  !*** ./src/services/transaction.service.ts ***!
  \*********************************************/
/*! exports provided: TransactionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TransactionService", function() { return TransactionService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");




var apiUrl = 'http://54.254.196.180:8000/getAccountTransactions/';
var TransactionService = /** @class */ (function () {
    function TransactionService(http) {
        this.http = http;
    }
    TransactionService.prototype.getData = function (publicKey) {
        var response1 = this.http.get(apiUrl + publicKey);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["forkJoin"])([response1]);
    };
    TransactionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], TransactionService);
    return TransactionService;
}());



/***/ })

}]);
//# sourceMappingURL=tab1-tab1-module.js.map