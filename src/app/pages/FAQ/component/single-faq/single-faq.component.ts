import { Component, Input, OnInit } from '@angular/core';
import { Faq } from 'src/app/core/interfaces/faq';

@Component({
  selector: 'app-single-faq',
  templateUrl: './single-faq.component.html',
  styleUrls: ['./single-faq.component.scss']
})
export class SingleFaqComponent implements OnInit {

  @Input() faq:Faq;

  constructor() {
    this.faq = {
      id:0,
      question:'',
      answer:''
    }
  }

  ngOnInit(): void {
  }

}
