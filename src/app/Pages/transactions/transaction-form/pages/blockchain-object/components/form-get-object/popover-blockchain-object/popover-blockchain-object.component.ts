import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { IBlockchainObjectItem } from '../../../helpers/interface';

@Component({
  selector: 'app-popover-blockchain-object',
  templateUrl: './popover-blockchain-object.component.html',
  styleUrls: ['./popover-blockchain-object.component.scss']
})
export class PopoverBlockchainObjectComponent implements OnInit {
  selectedIndex: number;

  blockchainObjectItems: IBlockchainObjectItem[]= [{
    title: "ZBO_F6CR...WD3R",
    desc: "2 minutes ago"
  },
  {
    title: "ZBO_F6CR...WFJ7",
    desc: "10 minutes ago"
  },
  {
    title: "ZBO_F6CR...OP6Y",
    desc: "2 days ago"
  },
  {
    title: "ZBO_F6CR...JK7Y",
    desc: "1 week ago"
  }];

  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
  ) { }

  async ngOnInit() {}

  async select(blockchainObjectItem: IBlockchainObjectItem) {
    this.popoverCtrl.dismiss(blockchainObjectItem);
  }

  goToBlockchainObject() {
    this.popoverCtrl.dismiss('');
    this.router.navigate(['/transaction-form/blockchain-object']);
  }

  cancel() {
    this.popoverCtrl.dismiss('');
  }
}
