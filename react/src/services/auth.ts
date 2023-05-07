import {ENTRYPOINT, HOST_NAME} from "../config/entrypoint.ts";
import {Storage} from "./storage.ts";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {axios} from "rxjs-axios";
import {User} from "../interfaces/User.ts";


export default class AuthService {
  readonly url = ENTRYPOINT

  private readonly _token$: BehaviorSubject<string | null>
  readonly token$: Observable<string | null>

  private readonly _me$: BehaviorSubject<User | null>;
  readonly me$: Observable<User | null>;

  get loggedIn(): boolean {
    return this._token$.value !== null;
  }

  constructor(private storage: Storage) {
    axios.interceptors.request.use(config => this.applyAuthOnRequest(config))
    axios.interceptors.response.use(null, response => this.logoutOnExpiration(response))

    this._me$ = new BehaviorSubject<User | null>(null);
    this.me$ = this._me$.asObservable();

    this._token$ = new BehaviorSubject(this.storage.getItem('_auth_token'));
    this.token$ = this._token$.asObservable();

    this.token$.subscribe(() => this.updateMe())

  }

  private updateMe() {
    if (this._token$.value === null) {
      this._me$.next(null);

      return;
    }

    axios.get(`${ENTRYPOINT}me`).subscribe(({data}) => this._me$.next(data || null));
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

  private logout() {
    this._me$.next(null);
    this._token$.next(null);
    this.storage.removeItem('_auth_token');
  }

  private logoutOnExpiration(error) {
    const status = error?.response?.status;
    if (status === 401 && error.response?.data?.message === 'Expired JWT Token') {
      this.logout()
    }

    return Promise.reject(error);
  }

  private applyAuthOnRequest(config) {
    const host = (new URL(config.url)).host;
    if (host === HOST_NAME && this._token$.value !== null) {
      config.headers['Authorization'] = `Bearer ${this._token$.value}`;
    }

    return config;
  }
}
