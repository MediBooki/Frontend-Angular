import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

    // Direction Variables
    lang: string = "en";
    rtlDir: boolean = false;
    direction: any = 'ltr';
    // navText: string[] = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel

    filterForm : FormGroup;

  @Input() carouselClass?:string;
  @Input() carouselType: OwlOptions = {} // Enabling Owl Carousel for Specialization Section
  @Input() carouselItems: any[] = [];
  defaultImg:string = this._DataService.defaultNoImg;

  // rtlDir: boolean = false;
  constructor(private _DataService:DataService, private _FormBuilder:FormBuilder, private router:Router) {
        // Declare FilterForm
        this.filterForm = this._FormBuilder.group({
          titles: new FormArray([]),
          genders: new FormArray([]),
          sections: new FormArray([]),
          name:"",
          specialization:""
        })
  }

  ngOnInit(): void {
    this.getLang();
  }
  ngOnChanges(){
    console.log(this.carouselItems)
  }



  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;

        if (language == 'en') {
          this.rtlDir = false;
          // this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-left'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-right'></i>"]; // arrows direction in owl carousel
          this.direction = 'ltr';
        } else {
          this.rtlDir = true;
          // this.navText = ["<i class='carousel-left fa-solid fs-4 fa-arrow-right'></i>", "<i class='carousel-right fa-solid fs-4 fa-arrow-left'></i>"];
          this.direction = 'rtl';
        }

      }
    })
  }

  // triggered when click on specialization to show doctors in this specialization
  // filterDoctors(specializationId:any, specializationName:any) {
  //   if(localStorage.getItem("filterForm") != null) {
  //     localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
  //   }
    
  //     localStorage.setItem("filteredSpecializationContent",JSON.stringify([`${specializationName}`])); // put new values in localstorage
  //     this.filterForm.value["sections"].push(''+specializationId+''); // add new filter measure in filter form
  //     localStorage.setItem("filterForm",JSON.stringify(this.filterForm.value)); // put new values in localstorage
  //     this.router.navigate(["/doctors"])

  // }


    // @HostListener('window:resize', ['$event'])
    // onResize(event:any) {
    //   let tez = event.target.innerWidth
    //   $('.main-carousel .owl-carousel .owl-item').css('width' , `${tez}px`)
    //   console.log(event.target.innerWidth);
    // }
  
}
