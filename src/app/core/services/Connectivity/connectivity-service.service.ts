import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private onlineStatus$: Subject<boolean>;

  constructor() {
    this.onlineStatus$ = new Subject<boolean>();
    this.registerOnlineEvent();
  }

  private registerOnlineEvent(): void {
    window.addEventListener('online', () => {
      this.onlineStatus$.next(true);
    });

    window.addEventListener('offline', () => {
      this.onlineStatus$.next(false);
    });
  }

  public getOnlineStatus(): Observable<boolean> {
    return this.onlineStatus$.asObservable();
  }
}
