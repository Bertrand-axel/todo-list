import AuthService from "../auth.ts";
import {Client} from "../http/client.ts";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../interfaces/User.ts";
import {axios} from "rxjs-axios";
import {ENTRYPOINT} from "../../config/entrypoint.ts";


export class CurrentUserProvider {
  private _user$: BehaviorSubject<User | null>;
  user$: Observable<User | null>;

  constructor(private readonly authService: AuthService, private client: Client) {

    this._user$ = new BehaviorSubject<User | null>(null);
    this.user$ = this._user$.asObservable();

    this.authService.token$.subscribe((token) => this.updateMe(token))
  }

  private updateMe(token: string | null) {
    if (token === null) {
      this._user$.next(null);

      return;
    }

    this.client.get(`${ENTRYPOINT}me`).subscribe(({data}) => this._user$.next(data || null));
  }

}
