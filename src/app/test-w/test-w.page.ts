import { Component, OnInit } from '@angular/core';
import { GrpcapiService } from 'src/services/grpc.service';

@Component({
  selector: 'app-test-w',
  templateUrl: './test-w.page.html',
  styleUrls: ['./test-w.page.scss'],
})
export class TestWPage implements OnInit {

  constructor(
    private grpcService: GrpcapiService
  ) { }

  async ngOnInit() {
    const test = await this.grpcService.getAccountBalance()
    console.log("account balance", test)
  }
}
