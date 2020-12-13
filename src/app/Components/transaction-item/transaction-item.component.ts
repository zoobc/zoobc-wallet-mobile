import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionItemComponent implements OnInit {
  @Input() transaction: any;

  constructor() {}

  ngOnInit() {}
}
