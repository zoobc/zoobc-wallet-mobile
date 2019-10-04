import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent {
  pin = '';
  dots = [];
  numbers = [];
  obs: any;

  @Output() keyup: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.dots = Array(6).fill(null).map((x, i) => i);
    this.numbers = Array(9).fill(null).map((x, i) => i);
  }

  clear() {
    this.pin = '';
    this.keyup.emit({
      first: true
    });
  }

  clearOne() {
    let l = this.pin.length;
    if (l > 0) {
      l = l - 1;
    }
    this.pin = this.pin.substring(0, l);
    if (this.pin.length === 1) {
      this.keyup.emit({
         first: true
     });
    }
  }

  handleInput(pin: string) {

    this.pin += pin;
    if (this.pin.length === 1) {
         this.keyup.emit({
            first: true
        });
    }

    if (this.pin.length === 6) {
      this.obs = new Observable(observer => {
        this.keyup.emit({
          observer,
          pin: this.pin
        });
      });

      this.obs.subscribe(() => {
        this.pin = '';
      });
    }
  }
}
