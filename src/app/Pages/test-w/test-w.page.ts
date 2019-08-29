import { Component, OnInit } from "@angular/core";
import { GRPCService } from "src/app/Services/grpc.service";

@Component({
  selector: "app-test-w",
  templateUrl: "./test-w.page.html",
  styleUrls: ["./test-w.page.scss"]
})
export class TestWPage implements OnInit {
  constructor(private grpcService: GRPCService) {}

  async ngOnInit() {
    const test = await this.grpcService.getAccountBalance();
    console.log("account balance", test);
  }
}
