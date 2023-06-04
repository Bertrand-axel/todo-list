import {Observable, Subject} from "rxjs";


export interface Message {
  content: string
  type?: 'default' | 'error' | 'success' | 'warning' | 'info'
}

export class ToastStack {

  private _source$: Subject<Message>;
  source$: Observable<Message>;

  constructor() {
    this._source$ = new Subject<Message>();
    this.source$ = this._source$.asObservable();
  }

  push(message: Message) {
    this._source$.next(message);
  }
}
