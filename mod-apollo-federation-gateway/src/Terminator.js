const { createHttpTerminator } = require('http-terminator');

class Terminator {
  constructor() {
    if (!Terminator.instance) {
      this.terminator = undefined;

      Terminator.instance = this;
    }

    return Terminator.instance;
  }

  terminate = async () => {
    return this.terminator?.terminate() ?? Promise.resolve();
  }

  set = server => {
    this.terminator = createHttpTerminator({ server })
  }
}

const instance = new Terminator();

module.exports = instance;
