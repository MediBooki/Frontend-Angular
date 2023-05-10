import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(private _DataService :DataService) { }

  ngOnInit(): void {
    this.getLang();
  }

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir:boolean = false;
  lang:string = "en";

  @Input() article:any;

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
