import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-applist',
  templateUrl: './applist.page.html',
  styleUrls: ['./applist.page.scss'],
})
export class ApplistPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  openSell() {
    this.router.navigateByUrl('/sell-coin');
  }

  coolApp() {
    this.router.navigateByUrl('/sell-coin');
  }

}
