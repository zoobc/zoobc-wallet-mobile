import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Account } from 'src/app/Interfaces/account';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountItemComponent implements OnInit {
  @Input() account: Account;
  @Input() horizontal: boolean;

  constructor() {
  }

  ngOnInit() {}
}
