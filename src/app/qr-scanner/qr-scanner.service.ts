import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  private listners = new Subject<string>();

  constructor() { }

  listen(): Observable<any> {
    return this.listners.asObservable();
  }

  setResult(data: string) {
    this.listners.next(data);
  }
}
