import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Contact } from 'src/app/Interfaces/contact';
import zoobc, { HostInfoResponse } from 'zbc-sdk';
import { TransactionService } from 'src/app/Services/transaction.service';

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
  constructor(private trxService: TransactionService) {


  }

  @Input() errors: any;
  @Input() submitted: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<IEscrow>();

  public escrow: IEscrow;
  public blockHeight: number;
  public strTimeout: string;

  ngOnInit() {

  //  this.strTimeout = new Date().toISOString();


    this.escrow = {
      approver: null,
      commission: 0,
      timeout: null,
      instruction: ''
    };

    this.escrow.commission = 0.01;
    this.getBlockHeight();
  }

  getBlockHeight() {
    zoobc.Host.getInfo()
      .then((res: HostInfoResponse) => {
        res.chainstatusesList.filter(chain => {
          if (chain.chaintype === 0) { this.blockHeight = chain.height; }
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally();
  }

  changeTimestamp() {
    const dateSelected = new Date(this.strTimeout);
    const dt = dateSelected.getTime() / 1000;
    this.escrow.timeout = Math.round(dt);
    this.onFormChange(this.escrow);
    this.onChange.emit(this.escrow);
  }


  changeForm() {
    this.onFormChange(this.escrow);
    this.onChange.emit(this.escrow);
  }

  onFormChange = (value: IEscrow) => {
  }

  onTouched = () => { };

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
