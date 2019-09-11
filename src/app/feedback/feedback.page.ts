import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goDashboard() {
    this.router.navigate(['/tabs/dashboard'])
  }

  addAddress() {
    alert('Not implement yet.');
  }

}
