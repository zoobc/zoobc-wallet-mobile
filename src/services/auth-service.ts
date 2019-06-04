import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';
import sha512 from 'crypto-js/sha512';

@Injectable()
export class AuthService implements CanActivate {
    private isUserLoggenIn = false
    constructor(
        private router: Router,
        private storage: Storage
    ) {

    }

    async canActivate(route: ActivatedRouteSnapshot) {

        if (!(await this.storage.get("pin")) && !this.isUserLoggenIn) {
            this.router.navigate(['initial']);
        }
        else if (!this.isUserLoggenIn) {
            this.router.navigate(['login']);
        }
        return true;
    }

    async login(pin) {
        const encryptedPin = sha512(pin.toString()).toString()
        const storedPin = await this.storage.get('pin')
        if(encryptedPin === storedPin) {
            this.isUserLoggenIn = true
            return true
        } else {
            return false
        }
    }
}