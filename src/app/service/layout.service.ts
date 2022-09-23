import { Component, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class LayoutService {

  // INFO:控制 loading
  pageLoading = false;
  pageLoading$ = new BehaviorSubject<Boolean>(true);

  setPageLoading(isLoad: boolean): void {
    // console.log('頁面 isLoad:', isLoad)
    if (isLoad === true) {
      this.pageLoading$.next(isLoad);
    }
    if (isLoad === false) {
      setTimeout(() => {
        this.pageLoading$.next(isLoad);
      }, 500);
    }
  }

}
