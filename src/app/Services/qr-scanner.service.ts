import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService implements OnInit {

  public qrScannerSubject: Subject<string> = new Subject<string>();
  constructor() { }

  ngOnInit() {
  }

  setResult(data: string) {
    this.qrScannerSubject.next(data);
  }
}
