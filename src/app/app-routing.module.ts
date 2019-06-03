import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/services/auth-service';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthService]},
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'selectwallet', loadChildren: './selectwallet/selectwallet.module#SelectwalletPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'create-wallet', loadChildren: './create-wallet/create-wallet.module#CreateWalletPageModule' },
  { path: 'generate-passphrase', loadChildren: './generate-passphrase/generate-passphrase.module#GeneratePassphrasePageModule' },
  { path: 'initial', loadChildren: './initial/initial.module#InitialPageModule' },
  { path: 'setup-pin', loadChildren: './setup-pin/setup-pin.module#SetupPinPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
