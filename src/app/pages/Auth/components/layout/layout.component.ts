import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  login?: boolean;
  lang: string = "en";
  rtlDir: boolean = false;
  @ViewChild('modalBtn') myButton: ElementRef | undefined;
  constructor(private service: AuthService) { }

  ngOnInit(): void {
    this.service.AuthlayoutLeft.subscribe(res => {
      this.login = res
    });
    // this.service.isLogedIn.next(false);
    this.service.istrigger.subscribe(res => {
      if (res === true) {
        this.triggerClick();
      }
    })
  }
  click() {
    this.login = !this.login
    // this.service.isLogin.next(false)
  }
  triggerClick() {
    let el: HTMLElement = this.myButton?.nativeElement as HTMLElement;
    el.click();
  }

}
