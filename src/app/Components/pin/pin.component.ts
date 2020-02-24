import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent {
  private start = 0;
  public pin = '';
  public pin2 = [];
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.initialPin();
  }

  initialPin() {
    this.start = 0;
    this.pin = '';
    this.pin2[0] = '_';
    this.pin2[1] = '_';
    this.pin2[2] = '_';
    this.pin2[3] = '_';
    this.pin2[4] = '_';
    this.pin2[5] = '_';
  }

  clear() {
    this.initialPin();
  }

  clearOne() {
    if (this.start > 0) {
      this.start--;
    }
    this.pin2[this.start] = '_';

    let l = this.pin.length;
    if (l > 0) {
      l = l - 1;
    }
    this.pin = this.pin.substring(0, l);
  }

  handleInput(pin: string) {

    if (this.pin.length === 6) {
      return;
    }

    this.pin += pin;
    this.pin2[this.start] = '*';

    if (this.pin.length === 6) {
      setTimeout(() => {
        this.ionChange.emit({
          pin: this.pin
        });
      }, 200);

      setTimeout(() => {
        this.initialPin();
      }, 1800);
      return;

    }
    this.start++;

  }
}
