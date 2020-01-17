import { Component, OnInit, forwardRef } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ModalListAccountComponent } from "./modal-list-account/modal-list-account.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "form-select-account",
  templateUrl: "./form-select-account.component.html",
  styleUrls: ["./form-select-account.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectAccountComponent),
      multi: true
    }
  ]
})
export class FormSelectAccountComponent
  implements OnInit, ControlValueAccessor {
  value;
  selectedItem: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  openModalList() {
    this.presentModalList();
  }

  async presentModalList() {
    const modal = await this.modalController.create({
      component: ModalListAccountComponent
    });
    modal.onDidDismiss().then(returnVal => {
      if (returnVal.data) {
        this.selectedItem = returnVal.data;

        this.changeData(returnVal.data);
      }
    });
    return await modal.present();
  }

  changeData(data) {
    this.value = data;
  }
  writeValue(value: any) {
    this.value = value;
    this.selectedItem = value;
  }
  registerOnChange(fn: any) {
    this.changeData = fn;
  }
  registerOnTouched(fn: any) {}
}
