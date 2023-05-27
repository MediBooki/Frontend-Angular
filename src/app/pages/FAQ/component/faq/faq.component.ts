import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { FaqService } from '../../service/faq.service';
import { Faq } from 'src/app/core/interfaces/faq';
import { Roadmap } from 'src/app/core/interfaces/roadmap';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit {

  lang: string = "en";
  rtlDir:boolean = false;

  roadMapLinks:Roadmap = {
    roadMabFirstLink: {arabic:'الرئيسية',english:'Home',link:'/home'},
    roadMabLastLink: {arabic:'الأسألة الشائعة',english:'FAQ'},
    roadMabIntermediateLinks: [
      // {arabic:'دوا',english:'phar',link:'/home'}
    ]
  }


  faqs:Faq[] = [
    {
      id:1 , 
      question:"How can I book a doctor?" , 
      answer:"You can book a doctor by opening 'Doctors' page and select the doctor you want to book then you will be redirected to appointment page where you can select day and time of booking then fill the form by your details and click button; or you can choose doctor from main slider in 'Home' page and click 'book now' button which will redirect you to 'Appointment' page. you can track your booking status from your profile 'My Appointments' tab."
    },
    {
      id:2 , 
      question:"How can I Buy Medicines?" , 
      answer:"You can buy medicines from our pharmacy by opening 'Pharmacy' page and select the medicine you want to buy and add it to cart, then go to 'Cart' page where you can change medicines quantity, after that go to 'Checkout' page and fill the form by your details and choose payment method then place order. you can track your order status from your profile 'Orders' tab."
    },
    {
      id:3 , 
      question:"Who can use MediBooki Website?" , 
      answer:"MediBooki is a website which is created to help 'Patients' to book doctors easily online or buy Medicines from pharmacy. 'Doctors' can use website too to join us in hospital."
    },
    {
      id:4 , 
      question:"If I'm a doctor, how can I join MediBooki hospital?" , 
      answer:"If you are a doctor, you can join us by opening 'Doctors Registration' page and fill the form by your details then submit your request and wait untill we contact you by E-mail."
    },
    {
      id:5 , 
      question:"What are available payment methods to buy medicines?" , 
      answer:"There are Two payment methods which are: 1-Cash on delivery, 2-Online using Paymob Service in which you can pay online easily using Credit Card."
    },
  ]

  // firstFaq:
  constructor(private _DataService: DataService, private _FaqService:FaqService) { }

  ngOnInit(): void {
    this.getLang();
  }


  getLang() {
    this._DataService._lang.subscribe({
      next: (lang) => {
        // const box = document.getElementsByClassName('.overlay-container');
        // console.log(box)
        this.lang = lang;
        if (lang == 'en') {
          this.rtlDir = false;
          // this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          // this.direction = 'rtl';
        }
      }})
  }
}
