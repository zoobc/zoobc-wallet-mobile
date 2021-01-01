import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Currency } from 'src/app/Interfaces/currency';
import { AccountService } from 'src/app/Services/account.service';
import { CurrencyRateService } from 'src/app/Services/currency-rate.service';
import { Address } from 'zbc-sdk';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionItemComponent implements OnInit {
  @Input() transaction: any;


  address: Address;
  status = '';
  color = '';

  currencyRate: Currency;

  constructor(private accountService: AccountService, private currencyServ: CurrencyRateService) {
    this.getAccount();
  }

  async getAccount() {
    this.address = (await this.accountService.getCurrAccount()).address;
    console.log('==this.addres = ', this.address);
    this.currencyServ.rate.subscribe(rate => (this.currencyRate = rate));
  }

  ngOnInit() {
    const approval = this.transaction.txBody.approval;
    this.color = approval === '0' ? 'yellow' : approval === '1' ? 'green' : approval === '2' ? 'red' : 'red';
    this.status =
      approval === '0' ? 'pending' : approval === '1' ? 'approved' : approval === '2' ? 'rejected' : 'expired';
  }

}
