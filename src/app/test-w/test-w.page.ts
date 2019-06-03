import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-w',
  templateUrl: './test-w.page.html',
  styleUrls: ['./test-w.page.scss'],
})
export class TestWPage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.testW()
  }

  testW() {
    // new (Worker as any)('../../workers/factorial', { type: 'module' })
    const worker = new (Worker as any)('../../workers/factorial', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');  
  }
}
