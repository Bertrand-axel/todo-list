import {ENTRYPOINT, HOST_NAME} from "../config/entrypoint.ts";
import {Storage} from "./storage.ts";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {axios} from "rxjs-axios";
import {User} from "../interfaces/User.ts";


export default class AuthService {
  readonly url = ENTRYPOINT

  private readonly _token$: BehaviorSubject<string | null>
  readonly token$: Observable<string | null>

  get loggedIn(): boolean {
    return this._token$.value !== null;
  }

  constructor(private storage: Storage) {
    this._token$ = new BehaviorSubject(this.storage.getItem('_auth_token'));
    this.token$ = this._token$.asObservable();
  }

  login(email: string): Observable<any> {
    const observable = axios.post<{ token: string }>(ENTRYPOINT + 'login_check', {email});

    return observable.pipe(
      tap({
        next: response => {
          const token = response.data.token;
          this.storage.setItem('_auth_token', token);
          this._token$.next(token);
        },
        error: (e) => console.error('failed login', e),
      })
    );
  }

  logout() {
    this._token$.next(null);
    this.storage.removeItem('_auth_token');
  }
}
