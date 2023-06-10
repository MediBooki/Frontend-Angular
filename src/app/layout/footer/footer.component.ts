import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { TermCondition } from 'src/app/core/interfaces/term-condition';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  // API Subscriptions Variables
  termsSubscription = new Subscription();

  constructor(private _DataService:DataService, private _AuthService:AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getTerms();
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

  termsConditions:TermCondition[]=[]

  getTerms() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;
        if (language == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;

        }
        
        this.termsSubscription = this._AuthService.getTerms(this.lang).subscribe({
          next:(terms)=>{
            console.log(terms)
            this.termsConditions = terms.data;
          }
        })

      }
    })
    
  }



  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.termsSubscription.unsubscribe();
  }
  
}
