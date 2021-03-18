import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth-service';
import { ZooKeyring, getZBCAddress } from 'zbc-sdk';
import * as wif from 'wif';
import { Account } from 'src/app/Interfaces/account';

@Component({
  selector: 'app-private-key',
  templateUrl: './private-key.page.html',
  styleUrls: ['./private-key.page.scss'],
})
export class PrivateKeyPage implements OnInit {

  form: FormGroup;
  privKeyField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private router: Router
  ) {
    this.form = new FormGroup({
      privateKey: this.privKeyField,
    });
  }


  ngOnInit(): void {

  }

  onLogin() {
    if (this.form.valid) {
      const bip = wif.decode(this.privKeyField.value);
      const keyring = new ZooKeyring('');
      const seed = keyring.generateBip32ExtendedKey('ed25519', bip);
      const address = getZBCAddress(seed.publicKey);

      const account: Account = {
        name: 'Imported Account',
        address: { type: 0, value: address },
        type: 'one time login',
      };
      if (this.authServ.loginWithoutPin(account, seed)) {
        this.router.navigateByUrl('/tabs/home');
      }
    } else {
      this.privKeyField.markAsTouched();
    }
  }

}
