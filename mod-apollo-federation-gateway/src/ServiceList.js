class ServiceList {
  constructor() {
    if (!ServiceList.instance) {
      this.list = [];

      ServiceList.instance = this;
    }

    return ServiceList.instance;
  }

  get = () => {
    return this.list;
  }

  add = service => {
    this.list = this.list.filter(s => s?.name !== service.name);
    this.list.push(service);

    return this.get();
  }

  delete = service => {
    this.list = this.list.filter(s => s?.name !== service.name);

    return this.get();
  }
}

const instance = new ServiceList();

module.exports = instance;
