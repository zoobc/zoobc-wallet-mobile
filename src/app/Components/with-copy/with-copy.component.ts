import { Component, Input } from '@angular/core';
import { UtilService } from 'src/app/Services/util.service';

@Component({
  selector: 'app-with-copy',
  templateUrl: './with-copy.component.html',
  styleUrls: ['./with-copy.component.scss'],
})
export class WithCopyComponent {

  @Input() title: string;
  @Input() value: string;
  
  constructor(private utilService: UtilService) { }

  copy(event) {
    event.stopPropagation();
    this.utilService.copyToClipboard(this.value);
  }

}
