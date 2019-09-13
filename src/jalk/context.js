class Context {
  constructor(parent = {}) {
    this.ctx = parent;
  }

  defvar(name, value) {
    // Mutable, dynamically typed variables.
    this.ctx[name] = value;
  }

  getvar(name) {
    if (name in this.ctx) {
      return this.ctx[name];
    } else {
      // TODO: does not exist
      throw ReferenceError;
    }
  }

  callfn(name, args) {
    if (name in this.ctx) {
      if (typeof this.ctx[name] == 'function') {
        return this.ctx[name](...args);
      } else {
        // TODO: is not a function
        throw EvalError;
      }
    } else {
      // TODO: does not exist
      throw EvalError;
    }
  }
}

module.exports = Context;