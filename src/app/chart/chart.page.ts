import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/services/chart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {


  private chartVal: any
  results: Observable<any>;


  constructor(private chrtSrv: ChartService) { }

  ngOnInit() {
      console.log('Data ini ');

      this.results = this.chrtSrv.getHistoryData();
      console.log('Cart DAta: '+ this.results);

  }

}
