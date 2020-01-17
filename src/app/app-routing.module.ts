import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';
import { QrScannerComponent } from './Pages/qr-scanner/qr-scanner.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './Pages/tabs/tabs.module#TabsPageModule',
    canActivate: [AuthService]
  },
  { path: 'qr-scanner', component: QrScannerComponent },
  { path: 'about', loadChildren: './Pages/about/about.module#AboutPageModule' },
  { path: 'login', loadChildren: './Pages/login/login.module#LoginPageModule' },
  {
    path: 'create-wallet',
    loadChildren: './Pages/create-wallet/create-wallet.module#CreateWalletPageModule'
  },
  {
    path: 'existing-wallet',
    loadChildren: './Pages/existing-wallet/existing-wallet.module#ExistingWalletPageModule'
  },
  {
    path: 'generate-passphrase',
    loadChildren:
      './Pages/generate-passphrase/generate-passphrase.module#GeneratePassphrasePageModule'
  },
  {
    path: 'initial',
    loadChildren: './Pages/initial/initial.module#InitialPageModule'
  },
  {
    path: 'setup-pin',
    loadChildren: './Pages/setup-pin/setup-pin.module#SetupPinPageModule'
  },
  {
    path: 'create-account',
    loadChildren:
      './Pages/create-account/create-account.module#CreateAccountPageModule'
  },
  {
    path: 'feedback',
    loadChildren: './Pages/feedback/feedback.module#FeedbackPageModule', canActivate: [AuthService]
  },
  { path: 'help', loadChildren: './Pages/help/help.module#HelpPageModule' },
  {
    path: 'notifications',
    loadChildren: './Pages/notifications/notifications.module#NotificationsPageModule'
  },
  { path: 'chart', loadChildren: './Pages/chart/chart.module#ChartPageModule' },
  {
    path: 'list-account',
    loadChildren: './Pages/list-account/list-account.module#ListAccountModule'
  },
  {
    path: 'address-book',
    loadChildren:
      './Pages/address-book/address-book.module#AddressBookPageModule'
  },
  {
    path: 'transaction',
    loadChildren: './Pages/transaction/transaction.module#TransactionPageModule'
  },
  {
    path: 'transaction/:transId',
    loadChildren:
      './Pages/transaction-detail/transaction-detail.module#TransactionDetailPageModule'
  },
  { path: 'senddetail', loadChildren: './Pages/send-coin/modals/senddetail/senddetail.module#SenddetailPageModule',
  canActivate: [AuthService] },
  { path: 'enterpinsend', loadChildren: './Pages/send-coin/modals/enterpinsend/enterpinsend.module#EnterpinsendPageModule' },
  { path: 'trxstatus', loadChildren: './Pages/send-coin/modals/trxstatus/trxstatus.module#TrxstatusPageModule',
  canActivate: [AuthService] },
  { path: 'sendcoin', loadChildren: './Pages/send-coin/send-coin.module#SendCoinPageModule',
   canActivate: [AuthService] },
  { path: 'add-address', loadChildren: './Pages/add-address/add-address.module#AddAddressPageModule', canActivate: [AuthService] },
  { path: 'backup-phrase', loadChildren: './Pages/backup-phrase/backup-phrase.module#BackupPhrasePageModule', canActivate: [AuthService] },
  { path: 'list-feedback', loadChildren: './Pages/feedback/list-feedback/list-feedback.module#ListFeedbackPageModule' },
  { path: 'my-tasks', loadChildren: './Pages/my-tasks/my-tasks.module#MyTasksPageModule' },
  { path: 'task-detail', loadChildren: './Pages/my-tasks/task-detail/task-detail.module#TaskDetailPageModule' },
  { path: 'pin-backup', loadChildren: './Pages/backup-phrase/pin/pin-backup/pin-backup.module#PinBackupPageModule' },  { path: 'settings', loadChildren: './Pages/settings/settings.module#SettingsPageModule' },
  { path: 'applist', loadChildren: './Pages/apps/applist/applist.module#ApplistPageModule' },
  { path: 'sell-coin', loadChildren: './Pages/apps/applist/sell/sell-coin/sell-coin.module#SellCoinPageModule' },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
