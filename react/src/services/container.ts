export class Container {

  private services = new Map<string, unknown>;
  private factories = new Map<string, () => Factory>;

  // list of services currently being generated, in order to detect circular dependencies
  private building: string[] = [];

  get<T>(name: string): T {
    if (this.building.includes(name)) {
      throw 'circular dependency encountered : ' + JSON.stringify([...this.building, name]);
    }

    if (!this.services.has(name)) {
      this.building.push(name);
      this.services.set(name, this.create(name));
    }

    const service = this.services.get(name);
    this.building.pop();

    return service;
  }

  private create<T>(name: string): T {
    return this.factories.get(name).create(this);
  }

  inject(name: string, factory: Factory): Container {
    this.factories.set(name, factory);

    return this;
  }
}

export class Factory {
  constructor(private _class, private dependencies: string[] = []) {}

  create(container: Container) {
    return new this._class(...this.dependencies.map((name: string) => container.get(name)));
  }
}
