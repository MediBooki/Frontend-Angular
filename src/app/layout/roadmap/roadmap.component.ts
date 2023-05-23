import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Roadmap } from 'src/app/core/interfaces/roadmap';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {

  rtlDir:boolean = false;
  lang: string = "en";

  @Input() roadMapLinks:Roadmap;
  constructor(private _DataService: DataService) {
    this.roadMapLinks = {
      roadMabFirstLink: {arabic:'',english:'',link:''},
      roadMabLastLink: {arabic:'',english:''},
      roadMabIntermediateLinks: [
        {arabic:'',english:'',link:''}
      ]
    }
  }

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
