import {ApiResource} from "../../utils/types.ts";
import {map, Observable, tap} from "rxjs";
import {Client} from "../http/client.ts";
import {ENTRYPOINT} from "../../config/entrypoint.ts";
import {PagedCollection} from "../../interfaces/Collection.ts";
import {ToastStack} from "../toastStack.ts";

interface SearchParams {
  page ?: number,
  pageSize ?: number,
  [key: string] : any,
}

export abstract class ResourceService<T extends ApiResource> {
  abstract path: string;
  basePath = ENTRYPOINT;

  constructor(protected readonly client: Client, protected readonly toastStack: ToastStack){}

  getCollection(params: SearchParams = {}): Observable<PagedCollection<T>> {
    return this.client
      .get(`${ENTRYPOINT}${this.path}`, {params: params})
      .pipe(
        tap({error: (error) => this.handleError(error)}),
        map(result => result.data)
      );
  }

  get(id: number): Observable<T> {
    return this.client
      .get(`${ENTRYPOINT}${this.path}/${id}`)
      .pipe(
        tap({error: (error) => this.handleError(error)}),
        map(result => result.data)
      );
  }

  save(resource: T): Observable<T> {
    const data = this.transformRelations(resource);
    if (data["@id"]) {
      return this.client
        .put(`${ENTRYPOINT}${this.path}/${data.id}`, data)
        .pipe(
          tap({
            error: (error) => this.handleError(error),
            complete: () => this.handleUpdateSuccess(),
          }),
          map(result => result.data)
        );
    }

    return this.client
      .post(`${ENTRYPOINT}${this.path}`, data)
      .pipe(
        tap({
          error: (error) => this.handleError(error),
          complete: () => this.handleCreationSuccess(),
        }),
        map(result => result.data)
      );
  }

  delete(resource: T): Observable<boolean> {
    return this.client
      .delete(`${ENTRYPOINT}${this.path}/${resource.id}`)
      .pipe(
        tap({
          error: (error) => this.handleError(error),
          complete: () => this.handleDeleteSuccess(),
        }),
        map(() => true)
      );
  }

  private transformRelations(resource: object) {
    const data = {};
    for (const field in resource) {
      if (resource[field] instanceof Array) {
        data[field] = resource[field].map((e) => e['@id']);
        continue;
      }
      if (resource[field] instanceof Object) {
        data[field] = resource[field]['@id'];
        continue;
      }
      data[field] = resource[field];
    }

    return data;
  }

  protected handleError(error: any) {
    const message: string = error?.response?.data?.['hydra:description'] || 'An error occurred';
    this.toastStack.push({content: message, type: 'error'});
  }

  protected handleDeleteSuccess() {
    this.toastStack.push({content: 'document deleted', type: 'success'});
  }

  protected handleCreationSuccess() {
    this.toastStack.push({content: 'document created', type: 'success'});
  }

  protected handleUpdateSuccess() {
    this.toastStack.push({content: 'document updated', type: 'success'});
  }
}
