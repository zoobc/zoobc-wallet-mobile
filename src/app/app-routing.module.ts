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
      './Pages/create-account/create-account.module#CreateAccountPageModule',
      canActivate: [AuthService]
  },
  {
    path: 'feedback',
    loadChildren: './Pages/feedback/feedback.module#FeedbackPageModule'},
  { path: 'help', loadChildren: './Pages/help/help.module#HelpPageModule' },
  {
    path: 'notifications',
    loadChildren: './Pages/notifications/notifications.module#NotificationsPageModule'
  },
  {
    path: 'list-account',
    loadChildren: './Pages/list-account/list-account.module#ListAccountModule',
    canActivate: [AuthService]
  },
  {
    path: 'address-book',
    loadChildren:
      './Pages/address-book/address-book.module#AddressBookPageModule',
      canActivate: [AuthService]
  },
  {
    path: 'transaction/:transId',
    loadChildren:
      './Pages/transaction-detail/transaction-detail.module#TransactionDetailPageModule',
      canActivate: [AuthService]
  },
  { path: 'senddetail', loadChildren: './Pages/send-coin/modals/senddetail/senddetail.module#SenddetailPageModule',
  canActivate: [AuthService] },
  { path: 'enterpinsend', loadChildren: './Pages/send-coin/modals/enterpinsend/enterpinsend.module#EnterpinsendPageModule' },
  { path: 'trxstatus', loadChildren: './Pages/send-coin/modals/trxstatus/trxstatus.module#TrxstatusPageModule',
  canActivate: [AuthService] },
  { path: 'sendcoin', loadChildren: './Pages/send-coin/send-coin.module#SendCoinPageModule',
   canActivate: [AuthService] },
  { path: 'add-address', loadChildren: './Pages/add-address/add-address.module#AddAddressPageModule', canActivate: [AuthService]},
  { path: 'backup-phrase', loadChildren: './Pages/backup-phrase/backup-phrase.module#BackupPhrasePageModule', canActivate: [AuthService] },
  { path: 'my-tasks', loadChildren: './Pages/my-tasks/my-tasks.module#MyTasksPageModule' },
  { path: 'task-detail', loadChildren: './Pages/my-tasks/task-detail/task-detail.module#TaskDetailPageModule' },
  { path: 'pin-backup', loadChildren: './Pages/backup-phrase/pin/pin-backup/pin-backup.module#PinBackupPageModule' },
  { path: 'settings', loadChildren: './Pages/settings/settings.module#SettingsPageModule' },
  { path: 'applist', loadChildren: './Pages/apps/applist/applist.module#ApplistPageModule' },
  { path: 'sell-coin', loadChildren: './Pages/apps/applist/sell/sell-coin/sell-coin.module#SellCoinPageModule' },
  { path: 'setup-pin-gp', loadChildren: './Pages/generate-passphrase/setup-pin-gp/setup-pin-gp.module#SetupPinGpPageModule' },
  { path: 'transactions', loadChildren: './Pages/transactions/transactions.module#TransactionsPageModule', canActivate: [AuthService] },
  { path: 'news', loadChildren: './Pages/news/news.module#NewsPageModule' },
    // tslint:disable-next-line:max-line-length
  { path: 'backuprestore-address', loadChildren: './Pages/backuprestore-address/backuprestore-address.module#BackuprestoreAddressPageModule' },  { path: 'reg-backup', loadChildren: './Pages/backuprestore-address/reg-backup/reg-backup.module#RegBackupPageModule' },
  { path: 'login-backup', loadChildren: './Pages/backuprestore-address/login-backup/login-backup.module#LoginBackupPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
