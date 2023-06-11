import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/data.service';
import { PatientProfileService } from '../../service/patient-profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {
  //constructor & dependency injection
  constructor(private _DataService:DataService, private _PatientProfileService:PatientProfileService, private toastr: ToastrService ,  private router: Router) { }

  ngOnInit(): void {
    this.getLang();
    this.getInvoices();
  }
/*--------------------------------------------------------------(variables)------------------------------- */

  lang:string = "en";
  rtlDir:boolean = false;
  direction:string = 'ltr';

  curruntColNum:number = 1;
  colDataIndex:number =0

  allInvoices:any[]=[];
  invoicesAPIres:any;
  allInvoices_notempty?:boolean=true;

  // API Subscriptions Variables
  invoicesSubscription = new Subscription();

/*--------------------------------------------------------------(methods)--------------------------------- */
  //----- Method 1
  // Setting Direction
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

  //----- Method 2
  nextcol(){
    if(this.curruntColNum<4){
      this.curruntColNum++;
    }else{
      this.curruntColNum=1;
    }
    console.log(this.curruntColNum);
  }

  //----- Method 3
  previousCol(){
    if(this.curruntColNum>1){
      this.curruntColNum--;
    }else{
      this.curruntColNum=4;
    }
    console.log(this.curruntColNum);
  }
  //----- Method 4
  gitColData(i:number){
    this.colDataIndex = i;
  }

  //----- Method 5
  //----- get all invoices
  getInvoices(){
    this._DataService._lang.subscribe({next:(language)=>{
    // to get all diagnosis
      this.invoicesSubscription = this._PatientProfileService.getInvoices(language).subscribe({
      next: (invoices) => {
        this.allInvoices = invoices.data;
        this.invoicesAPIres = invoices;
        this.allInvoices_notempty = this.allInvoices.length > 0;
        console.log(invoices);
      },
      error: (error) => {
        this.invoicesAPIres = error;
        this.allInvoices_notempty = false;
        console.log(error);
      }
      });
    }});
  }

  
  /*=============================================( Destroying Method )=============================================*/

  ngOnDestroy() {
    this.invoicesSubscription.unsubscribe();
  }


}
