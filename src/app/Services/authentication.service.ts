import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  constructor(private router: Router) {}

  public currentRoute = '';

  async canActivate(route: ActivatedRouteSnapshot) {
    this.currentRoute = route.url[0].path;

    var user = auth().currentUser;

    if (!user) {
      this.router.navigate(['/authentication']);
      return false;
    }

    return true;
  }

  register(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }
}
