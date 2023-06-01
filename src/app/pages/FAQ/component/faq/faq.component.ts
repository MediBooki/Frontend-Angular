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
      question_ar:"كيف يمكننى حجز طبيب؟" , 
      answer:"You can book a doctor by opening 'Doctors' page and select the doctor you want to book then you will be redirected to appointment page where you can select day and time of booking then fill the form by your details and click button; or you can choose doctor from main slider in 'Home' page and click 'book now' button which will redirect you to 'Appointment' page. you can track your booking status from your profile 'My Appointments' tab.",
      answer_ar:"يمكنك حجز طبيب عن طريق فتح صفحة 'الأطباء' واختيار الطبيب الذي تريد حجزه ، ثم سيتم توجيهك إلى صفحة المواعيد حيث يمكنك تحديد يوم ووقت الحجز ثم ملء النموذج ببياناتك والضغط على الزر ؛ أو يمكنك اختيار طبيب من شريط التمرير الرئيسي في الصفحة 'الرئيسية' والنقر فوق الزر 'احجز الآن' والذي سيعيد توجيهك إلى صفحة 'الموعد'. يمكنك تتبع حالة الحجز الخاصة بك من علامة التبويب 'مواعيدي' في ملفك الشخصي."
    },
    {
      id:2 , 
      question:"How can I Buy Medicines?" , 
      question_ar:"كيف يمكننى شراء دواء؟" , 
      answer:"You can buy medicines from our pharmacy by opening 'Pharmacy' page and select the medicine you want to buy and add it to cart, then go to 'Cart' page where you can change medicines quantity, after that go to 'Checkout' page and fill the form by your details and choose payment method then place order. you can track your order status from your profile 'Orders' tab.",
      answer_ar:"يمكنك شراء الأدوية من الصيدلية عن طريق فتح صفحة 'الصيدلية' واختيار الدواء الذي ترغب في شرائه وإضافته إلى عربة التسوق ، ثم الانتقال إلى صفحة 'عربة التسوق' حيث يمكنك تغيير كمية الأدوية ، وبعد ذلك انتقل إلى صفحة 'الخروج' و املأ النموذج ببياناتك واختر طريقة الدفع ثم قم بتقديم الطلب. يمكنك تتبع حالة طلبك من علامة التبويب 'الطلبات' في ملفك الشخصي."
    },
    {
      id:3 , 
      question:"Who can use MediBooki Website?" , 
      question_ar:"من يمكنه استخدام موقع ميدي بوكى؟" , 
      answer:"MediBooki is a website which is created to help 'Patients' to book doctors easily online or buy Medicines from pharmacy. 'Doctors' can use website too to join us in hospital.",
      answer_ar:"ميدي بوكى هو موقع ويب تم إنشاؤه لمساعدة 'المرضى' في حجز الأطباء بسهولة عبر الإنترنت أو شراء الأدوية من الصيدليات. يمكن لـ 'الأطباء' استخدام موقع الويب أيضًا للانضمام إلينا في المستشفى."
    },
    {
      id:4 , 
      question:"If I'm a doctor, how can I join MediBooki hospital?" , 
      question_ar:"إذا كنت طبيب ، كيف يمكنني الانضمام إلى مستشفى ميدي بوكى؟" , 
      answer:"If you are a doctor, you can join us by opening 'Doctors Registration' page and fill the form by your details then submit your request and wait untill we contact you by E-mail.",
      answer_ar:"إذا كنت طبيباً ، يمكنك الانضمام إلينا عن طريق فتح صفحة تسجيل الأطباء' وملء النموذج ببياناتك ثم إرسال طلبك والانتظار حتى نتصل بك عبر البريد الإلكتروني."
    },
    {
      id:5 , 
      question:"What are available payment methods to buy medicines?" , 
      question_ar:"ما هي طرق الدفع المتاحة لشراء الأدوية؟" , 
      answer:"There are Two payment methods which are: 1-Cash on delivery, 2-Online using Paymob Service in which you can pay online easily using Credit Card.",
      answer_ar:"هناك طريقتان للدفع وهما: 1-نقدًا عند التسليم ، 2-عبر الإنترنت باستخدام خدمة Paymob حيث يمكنك الدفع عبر الإنترنت بسهولة باستخدام بطاقة الائتمان."
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
