import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NewsService } from 'src/app/Services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  error: string;
  newsList: any;
  isLoadingNews = true;

  constructor(private newsSrv: NewsService, ) { }

  ngOnInit() {
    this.loadNews();
  }

  visitSite(url) {
    window.open(url, '_system');
  }

  doRefresh(event: any) {
    this.loadNews();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  async loadNews() {
    this.isLoadingNews = true;
    console.log('=== Will load news;');
    // Present a loading controller until the data is loaded
    // await this.presentLoading();
    // Load the data
    this.newsSrv.getNews()
        .pipe(
            finalize(async () => {
              console.log('==== news: ', this.newsList);
              this.isLoadingNews = false;
              // Hide the loading spinner on success or error
              // await this.loading.dismiss();
            })
        )
        .subscribe(
            data => {
              // Set the data to display in the template
              this.newsList = data['Data'];
            },
            err => {
              // Set the error information to display in the template
              console.log('==== news: ', err.statusText);
              this.isLoadingNews = false;
              this.error = `An error occurred, news could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
            }
        );
  }

}
