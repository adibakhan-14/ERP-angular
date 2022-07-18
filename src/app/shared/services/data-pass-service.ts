import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable({
    providedIn:'root'
})
export class DataService {
  data = [
    {
        "pending": [""]
    },
    {
        "loadCompleted": [""]
    },
    {
        "inTransit": [""]
    },
    {
        "unloadComplete": []
    }
] 
  private messageSource1 = new Subject();

  private messageSource = new BehaviorSubject(this.data);
  currentMessage = this.messageSource.asObservable();
  currentMessage1 = this.messageSource1.asObservable();

  constructor() { }

  changeMessage(message:any) {
    this.messageSource.next(message)
  }

  changeMessage1(message:any) {
    this.messageSource1.next(message)
  }

}


