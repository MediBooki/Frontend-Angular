import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ArticlesService } from '../../service/articles.service';
import { Subscription } from 'rxjs';
import { Roadmap } from 'src/app/core/interfaces/roadmap';
import { Article } from 'src/app/core/interfaces/article';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy  {


  // roadmap variable
  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'المقالات',english:'Articles'},
    roadMabIntermediateLinks: [

    ]
  }

  constructor(private _AuthService: AuthService,private _DataService: DataService, private _ArticlesService :ArticlesService ) { }

  ngOnInit(): void {
    // Promise.resolve().then(() => this._AuthService.isLogedIn.next(true));
    // Promise.resolve().then(() => this._DataService.isPageLoaded.next(false));
    this.getArticales();
    this.getLang();
  }

  // when view load completely
  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     Promise.resolve().then(()=>this._DataService.isPageLoaded.next(true))
  //   },0);
  // }

  /*=============================================( Variables )=============================================*/
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';
  noData:boolean = false;

  // Pagination Configuration Variables
  numArticlesPerPage: number = 10; // number of doctors displayed per one page
  page: any = 1; // set current page
  totalRecords: number = 0; // number of all doctors in whole API


  // apivariables
  articles: Article[] = [];
  articalsRes:any;

  // API Subscriptions Variables
  articalesSubscription = new Subscription();

  
  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  // Setting Direction
  getLang() {
    this._DataService._lang.subscribe({next:(language)=>{
      this.lang = language;

      if(language == 'en')
      {
        this.rtlDir = false;
        this.direction = 'ltr';
      } else {
        this.rtlDir = true;
        this.direction = 'rtl';
      }
    }})
  }

  //----- Method 2
  //----- get all Articales
  getArticales(){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all sections
    this.articalesSubscription = this._ArticlesService.getArticales(language,undefined,this.page).subscribe({
      next: (articles) => {

            this.totalRecords = articles.count
            if (this.page == 1) {
              this.numArticlesPerPage = articles.data.length // length of one page in API
            }


        this.articles = articles.data;
        console.log(articles);
        this.articalsRes = articles
        if(this.articles.length>0){
          this.noData = false;
          console.log(this.noData)
        }else{
          this.noData = true;
          console.log(this.noData)
        }
      },
      error: (error) => {
        console.log(error)
        this.articalsRes = error;
        this.noData = true;
      }
    });
    }});
  }

  //----- Method 6
  // changing page in pagination
  changePage(pageNum: any) {
    this.page = pageNum;
    console.log(this.page)
    this.getArticales();
  }

  
    /*=============================================( Destroying Method )=============================================*/

    ngOnDestroy() {
      this.articalesSubscription.unsubscribe();
    }
    
}
