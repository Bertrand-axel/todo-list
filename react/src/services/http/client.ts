import AuthService from "../auth.ts";
import {Axios} from "rxjs-axios";
import {RxjsAxios} from "rxjs-axios/dist/lib/RxjsAxios";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {Observable} from "rxjs";
import {HOST_NAME} from "../../config/entrypoint.ts";


export class Client {
  private axios: RxjsAxios;
  private token: string | null;

  constructor(protected authService: AuthService) {
    authService.token$.subscribe(token => {
      this.token = token
    });

    this.axios = Axios.create();

    this.axios.interceptors.response.use(null, response => {
      const status = response?.response?.status;
      if (status === 401 && response.response?.data?.message === 'Expired JWT Token' && (new URL(response.config.url)).host === HOST_NAME) {
        this.authService.logout()
      }

      return Promise.reject(response);
    })

    this.axios.interceptors.request.use((config) => {
      if (this.token !== null && config.headers && (new URL(config.url)).host === HOST_NAME) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }

      return config;
    })
  }

  get<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Observable<R> {
    return this.axios.get(url, config);
  }


  public delete<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    return this.axios.delete(url, config);
  }

  public post<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    return this.axios.post(url, data, config);
  }

  public put<T, R extends AxiosResponse<T> = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<R> {
    return this.axios.put(url, data, config);
  }

}
