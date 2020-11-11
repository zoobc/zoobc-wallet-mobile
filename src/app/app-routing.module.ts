import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';
import { QrScannerComponent } from './Pages/qr-scanner/qr-scanner.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './Pages/dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthService]
  },
  { path: 'qr-scanner', component: QrScannerComponent },
  { path: 'about', loadChildren: './Pages/about/about.module#AboutPageModule' },
  { path: 'login', loadChildren: './Pages/login/login.module#LoginPageModule' },
  {
    path: 'create-wallet',
    loadChildren:
      './Pages/wallet/create-wallet/create-wallet.module#CreateWalletPageModule'
  },
  {
    path: 'existing-wallet',
    loadChildren:
      './Pages/wallet/existing-wallet/existing-wallet.module#ExistingWalletPageModule'
  },
  {
    path: 'generate-passphrase',
    loadChildren:
      './Pages/wallet/generate-passphrase/generate-passphrase.module#GeneratePassphrasePageModule'
  },
  {
    path: 'initial',
    loadChildren: './Pages/initial/initial.module#InitialPageModule'
  },
  {
    path: 'setup-pin',
    loadChildren:
      './Pages/wallet/existing-wallet/setup-pin/setup-pin.module#SetupPinPageModule'
  },
  {
    path: 'create-account',
    loadChildren:
      './Pages/account/create-account/create-account.module#CreateAccountPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'feedback',
    loadChildren: './Pages/feedback/feedback.module#FeedbackPageModule'
  },
  { path: 'help', loadChildren: './Pages/help/help.module#HelpPageModule' },
  {
    path: 'notifications',
    loadChildren:
      './Pages/notifications/notifications.module#NotificationsPageModule'
  },
  {
    path: 'list-account',
    loadChildren: './Pages/account/list-account.module#ListAccountModule',
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
      './Pages/transactions/transaction-detail/transaction-detail.module#TransactionDetailPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'senddetail',
    loadChildren:
      './Pages/send-coin/modals/senddetail/senddetail.module#SenddetailPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'enterpinsend',
    loadChildren:
      './Pages/send-coin/modals/enterpinsend/enterpinsend.module#EnterpinsendPageModule'
  },
  {
    path: 'trxstatus',
    loadChildren:
      './Pages/send-coin/modals/trxstatus/trxstatus.module#TrxstatusPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'sendcoin',
    loadChildren: './Pages/send-coin/send-coin.module#SendCoinPageModule',
    canActivate: [AuthService]
  },

  {
    path: 'backup-phrase',
    loadChildren:
      './Pages/wallet/backup-phrase/backup-phrase.module#BackupPhrasePageModule',
    canActivate: [AuthService]
  },
  {
    path: 'my-tasks',
    loadChildren: './Pages/my-tasks/my-tasks.module#MyTasksPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'task-detail',
    loadChildren:
      './Pages/my-tasks/task-detail/task-detail.module#TaskDetailPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'pin-backup',
    loadChildren:
      './Pages/wallet/backup-phrase/pin/pin-backup/pin-backup.module#PinBackupPageModule'
  },
  {
    path: 'settings',
    loadChildren: './Pages/settings/settings.module#SettingsPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'applist',
    loadChildren: './Pages/apps/applist/applist.module#ApplistPageModule'
  },
  {
    path: 'sell-coin',
    loadChildren:
      './Pages/apps/applist/sell/sell-coin/sell-coin.module#SellCoinPageModule'
  },
  {
    path: 'setup-pin-gp',
    loadChildren:
      './Pages/wallet/generate-passphrase/setup-pin-gp/setup-pin-gp.module#SetupPinGpPageModule'
  },
  {
    path: 'transactions',
    loadChildren:
      './Pages/transactions/transactions.module#TransactionsPageModule',
    canActivate: [AuthService]
  },
  { path: 'news', loadChildren: './Pages/news/news.module#NewsPageModule' },
  {
    path: 'backuprestore-address',
    loadChildren:
      './Pages/address-book/backuprestore-address/backuprestore-address.module#BackuprestoreAddressPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'reg-backup',
    loadChildren:
      './Pages/address-book/backuprestore-address/reg-backup/reg-backup.module#RegBackupPageModule'
  },
  {
    path: 'login-backup',
    loadChildren:
      './Pages/address-book/backuprestore-address/login-backup/login-backup.module#LoginBackupPageModule'
  },
  {
    path: 'chat',
    loadChildren: './Pages/chat/chat.module#ChatPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'chat-session',
    loadChildren:
      './Pages/chat/chat-session/chat-session.module#ChatSessionPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'chat-profile',
    loadChildren:
      './Pages/chat/chat-profile/chat-profile.module#ChatProfilePageModule',
    canActivate: [AuthService]
  },
  {
    path: 'dashboard',
    loadChildren: './Pages/dashboard/dashboard.module#DashboardPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'receive',
    loadChildren: './Pages/receive/receive.module#ReceivePageModule',
    canActivate: [AuthService]
  },
  {
    path: 'confirmation',
    loadChildren:
      './Components/confirmation/confirmation.module#ConfirmationPageModule'
  },
  {
    path: 'multisig',
    loadChildren: './Pages/multisig/multisig.module#MultisigPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'msig-send-transaction',
    loadChildren:
      './Pages/multisig/msig-send-transaction/msig-send-transaction.module#MsigSendTransactionPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'msig-create-transaction',
    loadChildren:
      './Pages/multisig/msig-create-transaction/msig-create-transaction.module#MsigCreateTransactionPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'msig-add-info',
    loadChildren:
      './Pages/multisig/msig-add-info/msig-add-info.module#MsigAddInfoPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'edit-account',
    loadChildren:
      './Pages/account/edit-account/edit-account.module#EditAccountPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'account-popup',
    loadChildren:
      './Pages/account/account-popup/account-popup.module#AccountPopupPageModule'
  },
  {
    path: 'msig-add-signatures',
    loadChildren:
      './Pages/multisig/msig-add-signatures/msig-add-signatures.module#MsigAddSignaturesPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'popup-currency',
    loadChildren:
      './Pages/settings/popup-currency/popup-currency.module#PopupCurrencyPageModule'
  },
  {
    path: 'popup-languages',
    loadChildren:
      './Pages/settings/popup-languages/popup-languages.module#PopupLanguagesPageModule'
  },
  {
    path: 'scanqr-for-addressbook',
    loadChildren:
      './Pages/address-book/scanqr-for-addressbook/scanqr-for-addressbook.module#ScanqrForAddressbookPageModule'
  },
  {
    path: 'msig-task-detail',
    loadChildren:
      './Pages/my-tasks/msig-task-detail/msig-task-detail.module#MsigTaskDetailPageModule',
    canActivate: [AuthService]
  },
  { path: 'explanation-screen', loadChildren: './Pages/wallet/explanation-screen/explanation-screen.module#ExplanationScreenPageModule' },
  { path: 'import-account', loadChildren: './Pages/account/import-account/import-account.module#ImportAccountPageModule',
   canActivate: [AuthService]},
  { path: 'dataset-account', loadChildren: './Pages/account/dataset-account/dataset-account.module#DatasetAccountPageModule' ,
   canActivate: [AuthService]},
  { path: 'new-dataset', loadChildren: './Pages/account/dataset-account/new-dataset/new-dataset.module#NewDatasetPageModule',
   canActivate: [AuthService] },
  { path: 'import-draft', loadChildren: './Pages/multisig/import-draft/import-draft.module#ImportDraftPageModule',
    canActivate: [AuthService] },
  { path: 'escrow-history', loadChildren: './Pages/my-tasks/escrow-history/escrow-history.module#EscrowHistoryPageModule',
    canActivate: [AuthService] }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
