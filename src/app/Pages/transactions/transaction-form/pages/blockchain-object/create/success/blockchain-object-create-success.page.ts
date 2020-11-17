import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blockchain-object-create-success',
  templateUrl: './blockchain-object-create-success.page.html',
  styleUrls: ['./blockchain-object-create-success.page.scss']
})
export class BlockchainObjectCreateSuccessPage implements OnInit {
  constructor(
    private router: Router
  ) {}

  public stateValue: any;

  ngOnInit() {
    this.stateValue = this.router.getCurrentNavigation().extras.state;
  }

  done() {
    this.router.navigate(['tabs/home']);
  }
}
