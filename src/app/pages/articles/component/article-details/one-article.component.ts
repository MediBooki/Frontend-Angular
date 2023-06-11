import { Subscription } from 'rxjs';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../service/articles.service';
import { Roadmap } from 'src/app/core/interfaces/roadmap';
import { Article } from 'src/app/core/interfaces/article';

@Component({
  selector: 'app-one-article',
  templateUrl: './one-article.component.html',
  styleUrls: ['./one-article.component.scss']
})
export class OneArticleComponent implements OnInit, OnDestroy  {

  defaultImg:string = this._DataService.defaultNoImg;

      // roadmap variable
      roadMapLinks:Roadmap = {
        roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
        roadMabLastLink: {arabic:'تفاصيل المقالة',english:'Article Details'},
        roadMabIntermediateLinks: [
          {arabic:'المقالات',english:'Articles',link:'/articles'}
        ]
      }

      
  constructor(private _AuthService: AuthService,private _DataService: DataService,private _activatedRouting: ActivatedRoute,private _ArticlesService:ArticlesService ) {
    this.article = {
      created_at:'',
      description:'',
      id:0,
      title:'',
      photo:'',
      section:{
        id:0,
        name:'',
        description:'',
        photo:''
      }
    };
  }

  ngOnInit(): void {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
    this.getLang();
    this.articleId = this._activatedRouting.snapshot.params['id'];
    this.getArticle();
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
  articleId: any;

  //api variable
  article:Article;
  
  articleRes:any;

  // API Subscriptions Variables
  articleSubscription = new Subscription();

  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  @ViewChild('firstSection') firstSection: ElementRef | undefined;
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    this._DataService.firstSectionHeight = this.firstSection?.nativeElement.offsetHeight;
  }

  //----- Method 2
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

  //----- Method 3
  getArticle(){
    this._DataService._lang.subscribe({next:(language)=>{
      // to get all sections
      this.articleSubscription = this._ArticlesService.getOneArticale(language,this.articleId).subscribe({
        next: (article) => {
          this.article = article.data;
          console.log(article);
          this.articleRes = article;
        },
        error: (error) => {
          console.log(error)
          this.articleRes = null;
        }
      });
    }});
  }

  
    /*=============================================( Destroying Method )=============================================*/

    ngOnDestroy() {
      this.articleSubscription.unsubscribe();
    }
    

}
