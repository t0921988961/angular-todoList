import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  load(KEY: any) {
    return JSON.parse(window.localStorage.getItem(KEY) || 'null')
  }

  save(KEY: any, data: any) {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  }
}
