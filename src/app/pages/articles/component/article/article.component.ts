import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Article } from 'src/app/core/interfaces/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(private _DataService :DataService) {
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
    this.getLang();
    console.log(this.article)
  }

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";

  defaultImg:string = this._DataService.defaultNoImg;

  @Input() article:Article;

  /*=============================================( Component Created Methods )=============================================*/

  //----- Method 1
  getLang() {
    this._DataService._lang.subscribe({
      next:(lang)=>{
        this.lang = lang;
        if(lang == 'en')
        {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
      }
    });
  }

}
