import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService implements OnInit {

  private listners = new Subject<string>();

  constructor() { }

  ngOnInit() {
  }

  listen(): Observable<any> {
    return this.listners.asObservable();
  }

  setResult(data: string) {
    this.listners.next(data);
  }
}