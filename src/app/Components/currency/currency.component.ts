import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/Services/currency.service';
import { CURRENCY_LIST } from 'src/environments/variable.const';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  public searchTerm: string = "";
  public Object = Object;
  public currencyList: any;
  public currencyListOri: any;
  private activeCurrency: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.initialize();
    this.activeCurrency = '-';
  }

  getItems(ev: any) {
    const val = ev.target.value;
    this.currencyList = this.currencyListOri.filter((item: string) => {
      return (item.toLowerCase().indexOf(val.trim().toLowerCase()) > -1);
    })
  }

  initialize() {
    var myKeys = Object.keys(CURRENCY_LIST);
    this.currencyListOri =  myKeys.map(key => { 
      return key + " - " + CURRENCY_LIST[key]
    });
 
    this.currencyList = this.currencyListOri;
  }

  changeVal(arg: number){
    const val = this.currencyList[arg].split(" - ");
    this.activeCurrency = val[0];
    this.close();
  }

  close(){
    this.modalCtrl.dismiss(this.activeCurrency);
  }
}
