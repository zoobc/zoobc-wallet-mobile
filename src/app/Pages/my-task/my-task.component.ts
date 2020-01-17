import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ModalDetailComponent } from "./modal-detail/modal-detail.component";

@Component({
  selector: "app-my-task",
  templateUrl: "./my-task.component.html",
  styleUrls: ["./my-task.component.scss"]
})
export class MyTaskComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  tasks = [
    {
      title: "Approval-Send Money",
      amount: "10",
      prefix: "+",
      time: "3 weeks ago"
    },
    {
      title: "Approval-Multi Signature",
      amount: "5",
      prefix: "+",
      time: "2 weeks ago"
    }
  ];

  ngOnInit() {}

  selectTask() {
    this.presentModalDetail();
  }

  async presentModalDetail() {
    const modal = await this.modalCtrl.create({
      component: ModalDetailComponent
    });
    return await modal.present();
  }
}
