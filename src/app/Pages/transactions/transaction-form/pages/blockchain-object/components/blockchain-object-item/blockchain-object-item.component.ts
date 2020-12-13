import { Component, Input, OnInit } from '@angular/core';
import { IBlockchainObjectItem } from 'src/app/Interfaces/bc-object-item';

@Component({
  selector: 'app-blockchain-object-item',
  templateUrl: './blockchain-object-item.component.html',
  styleUrls: ['./blockchain-object-item.component.scss']
})
export class BlockchainObjectItemComponent implements OnInit {
  @Input() blockchainObjectItem: IBlockchainObjectItem;

  constructor() {
  }

  ngOnInit() {}
}
