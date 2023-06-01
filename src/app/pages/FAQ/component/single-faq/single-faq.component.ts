import { Component, Input, OnInit } from '@angular/core';
import { Faq } from 'src/app/core/interfaces/faq';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-single-faq',
  templateUrl: './single-faq.component.html',
  styleUrls: ['./single-faq.component.scss']
})
export class SingleFaqComponent implements OnInit {

  rtlDir:boolean = false;
  @Input() faq:Faq;

  constructor(private _DataService:DataService) {
    this.faq = {
      id:0,
      question:'',
      question_ar:'',
      answer:'',
      answer_ar:''
    }
  }
  
  ngOnInit(): void {
    this.getLang();
  }

  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {

        if (language == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }

      }
    })
  }
}
