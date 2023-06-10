import {Subject, Subscription} from "rxjs";

export interface Event {
  type: string,
  name: string
  data?: { [key: string]: any }
}

export class Broadcast {
  private readonly _subject$: Subject<Event> = new Subject();

  subscribe(callback: (Event) => any): Subscription {
    return this._subject$.subscribe(callback);
  }

  push(event: Event): void {
    this._subject$.next(event);
  }

}
