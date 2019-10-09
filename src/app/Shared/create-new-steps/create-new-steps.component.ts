import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-create-new-steps",
  templateUrl: "./create-new-steps.component.html",
  styleUrls: ["./create-new-steps.component.scss"]
})
export class CreateNewStepsComponent implements OnInit {
  @Input() active: number;

  constructor() {}

  ngOnInit() {}
}
