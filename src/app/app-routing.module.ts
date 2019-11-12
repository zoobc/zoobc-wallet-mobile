import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./Guards/auth.guard";
import { HasAccountGuard } from "./Guards/has-account.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./Pages/main/main.module#MainPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "qr-scanner",
    loadChildren: "./Pages/qr-scanner/qr-scanner.module#QrScannerPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "about",
    loadChildren: "./Pages/about/about.module#AboutPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "selectwallet",
    loadChildren:
      "./Pages/selectwallet/selectwallet.module#SelectwalletPageModule"
  },
  {
    path: "login",
    loadChildren: "./Pages/login/login.module#LoginPageModule",
    canActivate: [HasAccountGuard]
  },
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
    path: "existing-wallet",
    loadChildren:
      "./Pages/existing-wallet/existing-wallet.module#ExistingWalletPageModule"
  },
  { path: "test", loadChildren: "./Pages/test/test.module#TestPageModule" },
  {
    path: "node-admin",
    loadChildren: "./Pages/node-admin/node-admin.module#NodeAdminModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "feedback",
    loadChildren: "./Pages/feedback/feedback.module#FeedbackPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "help",
    loadChildren: "./Pages/help/help.module#HelpPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "notifications",
    loadChildren:
      "./Pages/notifications/notifications.module#NotificationsPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "chart",
    loadChildren: "./Pages/chart/chart.module#ChartPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "account",
    loadChildren: "./Pages/account/account.module#AccountModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "address-book",
    loadChildren:
      "./Pages/address-book/address-book.module#AddressBookPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "select-address",
    loadChildren:
      "./Pages/select-address/select-address.module#SelectAddressPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "transaction",
    loadChildren:
      "./Pages/transaction/transaction.module#TransactionPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "transaction/:transId",
    loadChildren:
      "./Pages/transaction-detail/transaction-detail.module#TransactionDetailPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "qr-scanner",
    loadChildren: "./Pages/qr-scanner/qr-scanner.module#QrScannerPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "setup-pin",
    loadChildren: "./Pages/setup-pin/setup-pin.module#SetupPinPageModule"
  },
  {
    path: "select-address",
    loadChildren:
      "./Pages/select-address/select-address.module#SelectAddressPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "my-task",
    loadChildren: "./Pages/my-task/my-task.module#MyTaskPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  },
  {
    path: "apps",
    loadChildren: "./Pages/apps/apps.module#AppsPageModule",
    canActivate: [HasAccountGuard, AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
