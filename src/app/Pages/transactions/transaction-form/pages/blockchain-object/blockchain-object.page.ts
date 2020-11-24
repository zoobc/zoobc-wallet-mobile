import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  PopoverController
} from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AddressBookService } from 'src/app/Services/address-book.service';
import { PopoverOptionComponent } from 'src/app/Shared/component/popover-option/popover-option.component';

@Component({
  selector: 'app-blockchain-object',
  templateUrl: './blockchain-object.page.html',
  styleUrls: ['./blockchain-object.page.scss']
})
export class BlockchainObjectPage implements OnInit {

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public addressbookService: AddressBookService,
    private router: Router,
    public popoverController: PopoverController,
    private translateSrv: TranslateService
  ) {}

  blockchainObjects = [
    {
      id: "ZBO_F6CR...WD3R",
      info: "5 days ago"
    },
    {
      id: "ZBO_F6CR...WFJ7",
      info: "4 days ago"
    },
    {
      id: "ZBO_F6CR...OP6Y",
      info: "3 days ago"
    },
    {
      id: "ZBO_F6CR...JK7Y",
      info: "2 days ago"
    }
  ];

  private textViewDetail: string;
  private textEdit: string;

  async ngOnInit() {
    this.translateSrv.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateLang();
    });

    this.translateLang();
  }

  translateLang() {
    this.translateSrv.get([
      'View Detail',
      'edit',
    ]).subscribe((res: any)=>{
      this.textViewDetail = res['View Detail'];
      this.textEdit = res['edit'];
    })
  }

  ngOnDestroy() {}

  createBlockchainObject() {
    this.router.navigate(['/transaction-form/blockchain-object/create']);
  }

  async showOption(ev: any, addressIndex: number) {
    const popover = await this.popoverController.create({
      component: PopoverOptionComponent,
      componentProps: {
        options: [
          {
            key: 'viewDetail',
            label: this.textViewDetail
          },
          {
            key: 'edit',
            label: this.textEdit
          }
        ]
      },
      event: ev,
      translucent: true
    });

    popover.onWillDismiss().then(({ data }) => {
      switch (data) {
        case 'viewDetail':
          this.router.navigate(['/transaction-form/blockchain-object/detail']);
          break;
        case 'edit':
          console.log("edit")
          break;
      }
    });

    return popover.present();
  }
}
