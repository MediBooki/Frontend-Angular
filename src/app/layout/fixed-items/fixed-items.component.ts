import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { DoctorService } from 'src/app/pages/doctors/service/doctor.service';

// to initiate Watson Chatbot
declare global {
  interface Window {
    watsonAssistantChatOptions: any;
  }
}

@Component({
  selector: 'app-fixed-items',
  templateUrl: './fixed-items.component.html',
  styleUrls: ['./fixed-items.component.scss']
})

export class FixedItemsComponent implements OnInit {

  /*=============================================( Variables )=============================================*/

  // Direction Variables
  rtlDir: boolean = false;

  // scrollUp variables
  showScrollBtn: boolean = false;
  firstSectionHeight: any;

  // Hospital Settings Variables
  hospitalPhone:string = "";
  hospitalWhatsApp:string = "";
  hospitalTelegram:string = "";
  
  // ChatBot variables
  createdChatBots:string[] = [] // created chatbots instances ('en' or 'ar' pushed when instance created)

  /*=============================================( Initialization Methods )=============================================*/

  constructor(private _DataService: DataService,private _DoctorService: DoctorService) { }

  ngOnInit(): void {
    this._DataService._lang.subscribe((language) => {
      if (language == 'en') {
        this.rtlDir = false;
        this.chatBotEnglishInit();
      } else {
        this.rtlDir = true;
        this.chatBotArabicInit();
      }
    })
    this.gethospitalDetails();
  }

  /*=============================================( Component Created Methods )=============================================*/

  /*---------------------------------------------( Scroll To Top )---------------------------------------------*/

  //----- Method 1
  @HostListener('window:scroll') // method triggered every scroll
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.firstSectionHeight = this._DataService.firstSectionHeight;
    if (scrollPosition >= this.firstSectionHeight - screen.height * 0.25) {
      this.showScrollBtn = true; // show scroll button
    } else {
      this.showScrollBtn = false; // hide scroll button
    }
  }

  //----- Method 2
  // triggered when clicking scrollBtn
  scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  /*---------------------------------------------( Chatbot )---------------------------------------------*/

  //----- Method 3
  // Initiate English Watson Chatbot
  chatBotEnglishInit() {

    // if we didn't create this english instance before then create it
    if(!this.createdChatBots.includes('en')) {

      // creating chatbot instance
      window.watsonAssistantChatOptions = {
        integrationID: "8e2494e8-7070-44ab-b191-5c247bc8a572",
        region: "eu-gb",
        serviceInstanceID: "8e45bf47-681a-4f9a-848a-166fe78ee70a",
        namespace: `UNIQUE_NAMESPACE_1`,
        onLoad: function(instance:any) { instance.render(); }
      };
  
      // add this instance to body
      const chatScript = document.createElement('script');
      chatScript.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
      document.head.appendChild(chatScript);
      this.createdChatBots.push("en") // to push 'en' in this array to know that it's instance created then don't create it again
    } else {

      let chatBotContainers = document.getElementsByClassName("WACWidget__regionContainer"); // contains arabic and english chatbots
      Array.from(chatBotContainers).forEach((ChatBot)=>{
        let chatBotFound = Array.from(ChatBot.attributes).find(attr => attr.name  == "aria-label" && attr.value.includes('UNIQUE_NAMESPACE_1'))
        if(chatBotFound != undefined) { // not undefined means that it's english version then show it 
          ChatBot.classList.remove("d-none");
        } else { // hide arabic version
          ChatBot.classList.add("d-none");
        }
      })

    }
    
  }

  //----- Method 4
  // Initiate Arabic Watson Chatbot
  chatBotArabicInit() {

    // if we didn't create this arabic instance before then create it
    if(!this.createdChatBots.includes('ar')) {

      // creating chatbot instance
      window.watsonAssistantChatOptions = {
        integrationID: "d803ba66-78df-4fdc-9a95-ab7fe30215b2",
        region: "eu-gb",
        serviceInstanceID: "8e45bf47-681a-4f9a-848a-166fe78ee70a",
        namespace: `UNIQUE_NAMESPACE_2`,
        onLoad: function(instance:any) { instance.render(); }
      };

      // add this instance to body
      const chatScript = document.createElement('script');
      chatScript.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
      document.head.appendChild(chatScript);
      this.createdChatBots.push("ar"); // to push 'ar' in this array to know that it's instance created then don't create it again
    } else {
      let chatBotContainers = document.getElementsByClassName("WACWidget__regionContainer"); // contains arabic and english chatbots
      Array.from(chatBotContainers).forEach((ChatBot)=>{
        let chatBotFound = Array.from(ChatBot.attributes).find(attr => attr.name  == "aria-label" && attr.value.includes('UNIQUE_NAMESPACE_2'))
        if(chatBotFound != undefined) {
          ChatBot.classList.remove("d-none"); // not undefined means that it's arabic version then show it 
        } else {
          ChatBot.classList.add("d-none"); // hide english version
        }
      })
    }

  }

  /*---------------------------------------------( Fast Links )---------------------------------------------*/

  //----- Method 5
  // Get Hospital Details
  gethospitalDetails() {
    this._DataService.gethospitalDetails().subscribe({
      next:(details)=>{
        console.log(details.data[0])
        this.hospitalPhone = details.data[0].phone;
        this.hospitalWhatsApp = details.data[0].whatsapp_phone;
        this.hospitalTelegram = details.data[0].whatsapp_phone;

      }
    })
  }

  //----- Method 6
  // Open WhatsApp Chat When Clicking WhatsApp Icon
  openWhatsApp() {
    if(this.hospitalWhatsApp != "") {
      window.open(`https://wa.me/+2${this.hospitalWhatsApp}`, "_blank");
    }
  }

  //----- Method 7
  // Open Telegram Chat When Clicking Telegram Icon
  openTelegram() {
    if(this.hospitalTelegram != "") {
      window.open(`https://t.me/+2${this.hospitalTelegram}`, "_blank");
    }
  }
}
