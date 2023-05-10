import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private _DataService:DataService, private _TranslateService:TranslateService) { }

  ngOnInit(): void {
  }
  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';


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
}
