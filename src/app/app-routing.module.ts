import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthService } from "src/app/Services/auth-service";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./Pages/main/main.module#MainPageModule",
    canActivate: [AuthService]
  },
  {
    path: "qr-scanner",
    loadChildren: "./Pages/qr-scanner/qr-scanner.module#QrScannerPageModule"
  },
  { path: "about", loadChildren: "./Pages/about/about.module#AboutPageModule" },
  {
    path: "selectwallet",
    loadChildren:
      "./Pages/selectwallet/selectwallet.module#SelectwalletPageModule"
  },
  { path: "login", loadChildren: "./Pages/login/login.module#LoginPageModule" },
  {
    path: "create-wallet",
    loadChildren:
      "./Pages/create-wallet/create-wallet.module#CreateWalletPageModule"
  },
  {
    path: "generate-passphrase",
    loadChildren:
      "./Pages/generate-passphrase/generate-passphrase.module#GeneratePassphrasePageModule"
  },
  {
    path: "initial",
    loadChildren: "./Pages/initial/initial.module#InitialPageModule"
  },
  {
    path: "setup-pin",
    loadChildren: "./Pages/setup-pin/setup-pin.module#SetupPinPageModule"
  },
  { path: "login", loadChildren: "./Pages/login/login.module#LoginPageModule" },
  {
    path: "test-w",
    loadChildren: "./Pages/test-w/test-w.module#TestWPageModule"
  },
  {
    path: "existing-wallet",
    loadChildren:
      "./Pages/existing-wallet/existing-wallet.module#ExistingWalletPageModule"
  },
  { path: "test", loadChildren: "./Pages/test/test.module#TestPageModule" },
  {
    path: "create-account",
    loadChildren:
      "./Pages/create-account/create-account.module#CreateAccountPageModule"
  },
  {
    path: "node-admin",
    loadChildren: "./Pages/node-admin/node-admin.module#NodeAdminModule"
  },
  {
    path: "feedback",
    loadChildren: "./Pages/feedback/feedback.module#FeedbackPageModule"
  },
  { path: "help", loadChildren: "./Pages/help/help.module#HelpPageModule" },
  {
    path: "notifications",
    loadChildren:
      "./Pages/notifications/notifications.module#NotificationsPageModule"
  },
  { path: "chart", loadChildren: "./Pages/chart/chart.module#ChartPageModule" },
  {
    path: "list-account",
    loadChildren: "./Pages/list-account/list-account.module#ListAccountModule"
  },
  {
    path: "address-book",
    loadChildren:
      "./Pages/address-book/address-book.module#AddressBookPageModule"
  },
  {
    path: "transaction",
    loadChildren: "./Pages/transaction/transaction.module#TransactionPageModule"
  },
  {
    path: "transaction/:transId",
    loadChildren:
      "./Pages/transaction-detail/transaction-detail.module#TransactionDetailPageModule"
  },
  {
    path: "qr-scanner",
    loadChildren: "./Pages/qr-scanner/qr-scanner.module#QrScannerPageModule"
  },
  {
    path: "setup-pin",
    loadChildren: "./Pages/setup-pin/setup-pin.module#SetupPinPageModule"
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
