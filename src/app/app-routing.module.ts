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
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';
import { QrScannerComponent } from './Pages/qr-scanner/qr-scanner.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './Pages/home/home.module#HomePageModule',
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
    path: 'enterpinsend',
    loadChildren:
      './Pages/send-coin/modals/enterpinsend/enterpinsend.module#EnterpinsendPageModule'
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
  {
    path: 'transaction-form',
    loadChildren:
      './Pages/transactions/transaction-form/transaction-form.module#TransactionFormPageModule',
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
  {
    path: 'explanation-screen',
    loadChildren:
      './Pages/wallet/explanation-screen/explanation-screen.module#ExplanationScreenPageModule'
  },
  { path: 'tabs', loadChildren: './Pages/tabs/tabs.module#TabsPageModule', canActivate: [AuthService] },
  { path: 'home', loadChildren: './Pages/home/home.module#HomePageModule', canActivate: [AuthService] },
  { path: 'theme', loadChildren: './Pages/theme/theme.module#ThemePageModule', canActivate: [AuthService] },
  { path: 'network', loadChildren: './Pages/network/network.module#NetworkPageModule', canActivate: [AuthService] },
  { path: 'explanation-screen', loadChildren: './Pages/wallet/explanation-screen/explanation-screen.module#ExplanationScreenPageModule' },
  {
    path: 'import-account', loadChildren: './Pages/account/import-account/import-account.module#ImportAccountPageModule',
    canActivate: [AuthService]
  },
  { path: 'msig-detail', loadChildren: './Pages/multisig/msig-detail/msig-detail.module#MsigDetailPageModule',
    canActivate: [AuthService] }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
