import { Component, OnInit } from '@angular/core';
import { NETWORK_LIST } from 'src/environments/variable.const';
import { NavController } from '@ionic/angular';
import { NetworkService } from 'src/app/Services/network.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

  constructor(private navCtrl: NavController, private networkSrv: NetworkService) { }

  networks = NETWORK_LIST;
  activeNetwork = null;

  async ngOnInit() {
    this.activeNetwork = await this.networkSrv.getNetwork();
  }

  selectNetwork(index: any){
    this.networkSrv.setNetwork(index)
    this.networkSrv.broadcastSelectNetwork(this.networks[index]);
    this.navCtrl.pop();
  }

}
