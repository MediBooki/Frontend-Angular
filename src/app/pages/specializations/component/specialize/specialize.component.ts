import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Specialize } from 'src/app/core/interfaces/specialize';
import { DataService } from 'src/app/core/services/data.service';
// import { SpecializationService } from 'src/app/core/services/specialization/specialization.service';
import { SpecializationService } from '../../service/specializations.service';

@Component({
  selector: 'app-specialize',
  templateUrl: './specialize.component.html',
  styleUrls: ['./specialize.component.scss']
})
export class SpecializeComponent implements OnInit {

  // Direction Variables
  lang: string = "en";
  rtlDir: boolean = false;

  defaultSpecializationImg:string = this._DataService.defaultNoImg;



  @Input() specialize!:Specialize;

  constructor(private _DataService: DataService, private _FormBuilder:FormBuilder, private router:Router) { 

  }

  ngOnInit(): void {
    this.getLang()
  }


  getLang() {
    this._DataService._lang.subscribe({
      next: (language) => {
        this.lang = language;
        if (language == 'en') {
          this.rtlDir = false;
        } else {
          this.rtlDir = true;
        }
      }
    })
  }

  



}
