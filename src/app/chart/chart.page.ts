import { Component, ViewChild, OnInit } from '@angular/core';
import { ChartService } from 'src/services/chart.service';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})



export class ChartPage implements OnInit {


  private lineChart: GoogleChartInterface;  
  public candlestickChart : GoogleChartInterface;

  private results: any;

  private candledata: any;

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  private chartTitle: string;
  
  constructor(private chrtSrv: ChartService) { }


  ngOnInit() {    
      this.chrtSrv.getDailyData().subscribe(
        (res) => {
          this.loadCandleStickData(res);
          this.loadCandleStickChart();
        },
        (err) => console.log(err),
        () => console.log('done..!')
      );
      
      this.chartTitle = "Daily Chart";
  }


  loadCandleStickData(res){
    const aa=[];
    for (let i=0; i< res.length; i++){
      const dt = res[i]
      aa.push([
        new Date(dt.time * 1000),
        dt.low,
        dt.open,
        dt.close,
        dt.high
      ])
    }
    this.results = aa;
    console.log(this.results);
  }
  

  loadCandleStickChart(){
    this.candlestickChart ={
      chartType: 'CandlestickChart',
      dataTable: this.results,
      opt_firstRowIsData: true,
      options: {
        legend: 'none',
        label: 'none',
        height: 400,
        candlestick: {
          fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
          risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
        }
      }
    };
  }
  
  dailyChart(){
    this.chrtSrv.getDailyData().subscribe(
      (res) => {
        this.loadCandleStickData(res);
        this.candlestickChart.dataTable = this.results;
      },
      (err) => console.log(err),
      () => console.log('done..!')
    );
    this.chartTitle = "Daily Chart";
  }

  weeklyChart(){
    this.chrtSrv.getWeeklyData().subscribe(
      (res) => {
        this.loadCandleStickData(res);
        this.candlestickChart.dataTable = this.results;
        
        //this.loadCandleStickChart(res)
      },
      (err) => console.log(err),
      () => console.log('done..!')
    );
    this.chartTitle = "Weekly Chart";
  }

  monthlyChart(){
    this.chrtSrv.getMonthlyData().subscribe(
      (res) => {
        this.loadCandleStickData(res);
        this.candlestickChart.dataTable = this.results;
        //this.loadCandleStickChart(res)
      },
      (err) => console.log(err),
      () => console.log('done..!')
    );
    this.chartTitle = "Monthly Chart";
  }

  ionViewDidEnter() {
    this.loadLineChart();
    console.log('daa', this.results);
  }


  loadLineChart() {
    this.lineChart = {
      chartType: 'AreaChart',
      dataTable: [
        [0, 0], [1, 10], [2, 23], [3, 17], [4, 18], [5, 9],
        [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
        [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
        [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
        [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
        [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
        [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
        [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
        [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
        [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
        [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
        [66, 70], [67, 72], [68, 75], [69, 80]
      ],
      opt_firstRowIsData: true,
      options : {
        legend: 'none',
        bar: { groupWidth: '100%' },
      },

    };
  }


}
