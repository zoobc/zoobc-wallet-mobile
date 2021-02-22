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
  public  strTimeout: string;

  ngOnInit() {

    this.strTimeout = new Date().toISOString();


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



  convertDateToHeight() {
   // const dt1 = Date.now();
    // const date1 = Math.floor(dt1 / 1000);
    const date2 = new Date(this.strTimeout);
    const dt = date2.getTime() / 1000;

    this.strTimeout = new Date().toISOString();


    // console.log('Time selected: ', dt);
    // if(dt < date1) {
      // this.strTimeout = dt1.toString();
      // dt = date1;
    // }
    // co//nsole.log('date1: ', date1);
    // console.log('date2: ', date2);
    // const seconds = (date2.getTime() - date1.getTime()) / 1000;
    // console.log('seconds: ', seconds);
    // const height = Math.round(seconds / 15);
    // console.log('Math.round(dt);: ', Math.round(dt));
    this.escrow.timeout = Math.round(dt);

    // this.trxService.txTimeOut =  Math.round(dt);

  }

  changeForm() {


    // this.onFormChange(this.escrow);
    // this.onChange.emit(this.escrow);
    this.convertDateToHeight();
    this.trxService.updateEscrowForm(this.escrow);
    // this.trxService.msgEscrow = this.escrow.instruction;

  }

  onFormChange = (value: IEscrow) => {
   // console.log( 'form Changed', value);
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
