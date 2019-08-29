import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  private _listners = new Subject<string>();

  constructor() { }

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  setResult(data: string) {
    this._listners.next(data);
  }
}
