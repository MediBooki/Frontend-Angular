import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/pages/Auth/services/auth.service';
import { TermCondition } from 'src/app/core/interfaces/term-condition';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactUsService } from 'src/app/pages/contact-us/service/contact-us.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  // API Subscriptions Variables
  termsSubscription = new Subscription();
  contactsSubscription = new Subscription();
  contacts: any;

  constructor(private _DataService:DataService, private _AuthService:AuthService, private router: Router, private _contactus:ContactUsService) { }

  ngOnInit(): void {
    this.getTerms();
    this.getcontacts();
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

  getcontacts() {
    this.contactsSubscription = this._contactus.getContact().subscribe({
      next:(res)=>{
        this.contacts = res.data[0];
      }
    })
}

  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.termsSubscription.unsubscribe();
    this.contactsSubscription.unsubscribe();
  }

}
