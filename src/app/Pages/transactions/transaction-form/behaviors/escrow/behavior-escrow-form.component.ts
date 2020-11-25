import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Contact } from 'src/app/Interfaces/contact';
import zoobc from 'zoobc-sdk';

interface IEscrow {
  approver: Contact;
  commission: number;
  timeout: number;
  instruction: string;
}

@Component({
  selector: 'app-behavior-escrow-form',
  templateUrl: './behavior-escrow-form.component.html',
  styleUrls: ['./behavior-escrow-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BehaviorEscrowFormComponent),
      multi: true
    }
  ]
})
export class BehaviorEscrowFormComponent
  implements OnInit, ControlValueAccessor {
  constructor() {}

  @Input() errors: any;
  @Input() submitted: boolean;
  @Output() onChange = new EventEmitter<IEscrow>();

  public escrow: IEscrow;
  public blockHeight: number;

  ngOnInit() {
    this.escrow = {
      approver: null,
      commission: 0,
      timeout: 0,
      instruction: ''
    };

    this.getBlockHeight();
  }

  getBlockHeight() {
    zoobc.Host.getInfo()
      .then(res => {
        this.blockHeight = res.chainstatusesList[1].height;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {});
  }

  changeForm() {
    this.onFormChange(this.escrow);
    this.onChange.emit(this.escrow);
  }

  onFormChange = (value: IEscrow) => {};

  onTouched = () => {};

  writeValue(value: IEscrow) {
    this.escrow = value;
  }

  registerOnChange(fn: (value: IEscrow) => void) {
    this.onFormChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
