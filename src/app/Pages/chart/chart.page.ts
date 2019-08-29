import { Component, ViewChild, OnInit } from "@angular/core";
import { ChartService } from "src/app/Services/chart.service";
import { Chart } from "chart.js";
import { GoogleChartInterface } from "ng2-google-charts/google-charts-interfaces";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.page.html",
  styleUrls: ["./chart.page.scss"]
})
export class ChartPage implements OnInit {
  @ViewChild("hrzLineChart") hrzLineChart;

  private hrzLines: any;
  public candlestickChart: GoogleChartInterface;
  private results: any;

  @ViewChild("barCanvas") barCanvas;
  @ViewChild("lineCanvas") lineCanvas;

  private chartTitle: string;

  constructor(private chrtSrv: ChartService) {}

  ngOnInit() {
    this.chrtSrv.getDailyData().subscribe(
      res => {
        this.loadCandleStickData(res);
        this.loadCandleStickChart();
      },
      err => console.log(err),
      () => console.log("done..!")
    );

    this.chartTitle = "Daily Chart";
  }

  createSimpleLineChart(label, datas) {
    this.hrzLines = new Chart(this.hrzLineChart.nativeElement, {
      type: "line",
      data: {
        labels: label,
        datasets: [
          {
            label: "",
            data: datas,
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgb(38, 194, 129)",
            borderWidth: 1
          }
        ],
        options: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadCandleStickData(res) {
    const aa = [];
    for (let i = 0; i < res.length; i++) {
      const dt = res[i];
      aa.push([new Date(dt.time * 1000), dt.low, dt.open, dt.close, dt.high]);
    }
    this.results = aa;
    console.log(this.results);
  }

  loadCandleStickChart() {
    this.candlestickChart = {
      chartType: "CandlestickChart",
      dataTable: this.results,
      opt_firstRowIsData: true,
      options: {
        height: 450,
        chartArea: { left: 55, height: "80%", right: 15 },
        legend: "none",
        candlestick: {
          fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
          risingColor: { strokeWidth: 0, fill: "#0f9d58" } // green
        }
      }
    };
  }

  dailyChart() {
    this.getMarketPricesData("day");
    // this.chrtSrv.getDailyData().subscribe(
    //   (res) => {
    //     this.loadCandleStickData(res);
    //     this.candlestickChart.dataTable = this.results;
    //   },
    //   (err) => console.log(err),
    //   () => console.log('done..!')
    // );
    this.chartTitle = "Daily Chart";
  }

  weeklyChart() {
    this.getMarketPricesData("week");

    // this.chrtSrv.getWeeklyData().subscribe(
    //   (res) => {
    //     this.loadCandleStickData(res);
    //     this.candlestickChart.dataTable = this.results;

    //     //this.loadCandleStickChart(res)
    //   },
    //   (err) => console.log(err),
    //   () => console.log('done..!')
    // );
    this.chartTitle = "Weekly Chart";
  }

  monthlyChart() {
    this.getMarketPricesData("month");
    // this.chrtSrv.getMonthlyData().subscribe(
    //   (res) => {
    //     this.loadCandleStickData(res);
    //     this.candlestickChart.dataTable = this.results;
    //     //this.loadCandleStickChart(res)
    //   },
    //   (err) => console.log(err),
    //   () => console.log('done..!')
    // );
    this.chartTitle = "Monthly Chart";
  }

  public price: any;
  public rank: any;
  public volume: any;
  public marketcap: number;
  public cryptoId: string;

  getTimeFormat(unix_timestamp, arg) {
    var a = new Date(unix_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ":" + min;

    if (arg == "week") {
      time = date + " " + month + " " + hour + ":" + min;
    } else if (arg == "month") {
      time = month + " " + year;
    }

    return time;

    // var dt = new Date(unix_timestamp*1000);

    // var year = dt.getFullYear();
    // var month = dt.getMonth();
    // var date = dt.getDate();

    // // Hours part from the timestamp
    // var hours = dt.getHours();
    // // Minutes part from the timestamp
    // var minutes = "0" + dt.getMinutes();
    // // Seconds part from the timestamp
    // var seconds = "0" + dt.getSeconds();

    // var formattedTime = hours + ':' + minutes.substr(-2) ;
    // if (arg=='week'){
    //   formattedTime = date + '/' + month + '/' + year;
    // }else if (arg=='month'){
    //    formattedTime = date + '/' + month + '/' + year;
    // }

    // return formattedTime;
  }

  async getMarketPricesData(arg) {
    this.chrtSrv.getCoinMarketPrice(arg).subscribe(res => {
      const labels = [];
      const datas = [];

      for (let i = 0; i < res.length; i++) {
        const dt = res[i];
        labels.push(this.getTimeFormat(dt.time, arg));
        datas.push(dt.high);
      }
      this.createSimpleLineChart(labels, datas);
    });
  }

  async getPriceData() {
    this.chrtSrv.getCoinPrice().subscribe(res => {
      if (res && res.length > 0) {
        let prd = res[0];
        this.cryptoId = prd.id;
        this.price = prd.current_price;
        this.marketcap = prd.market_cap;
        this.volume = prd.total_volume;
        this.rank = prd.market_cap_rank;

        console.log("show price: ", prd);
      }
    });
  }

  ionViewDidEnter() {
    this.getMarketPricesData("day");
    this.getPriceData();
  }
}
