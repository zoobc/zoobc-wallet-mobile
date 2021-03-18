import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/Interfaces/account';
import { AuthService } from 'src/app/Services/auth-service';

@Component({
  selector: 'app-zbc-address',
  templateUrl: './zbc-address.page.html',
  styleUrls: ['./zbc-address.page.scss'],
})
export class ZbcAddressPage implements OnInit {

  form: FormGroup;
  addressField = new FormControl('', Validators.required);

  constructor(
    private authServ: AuthService,
    private router: Router
  ) {
    this.form = new FormGroup({
      address: this.addressField,
    });
  }

  ngOnInit(): void {
  }

  onLogin() {
    if (this.form.valid) {
      const account: Account = {
        name: 'View Only Account',
        address: { type: 0, value: this.addressField.value },
        type: 'address',
      };
      if (this.authServ.loginWithoutPin(account)) {
        this.router.navigateByUrl('/tabs/home');
      }
    } else {
      this.addressField.markAsTouched();
    }
  }

}
