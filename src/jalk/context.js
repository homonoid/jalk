class Context {
  constructor(parent = {}) {
    this.ctx = parent;
  }

  defvar(name, value) {
    // Mutable, non-typed variables.
    this.ctx[name] = value;
  }

  getvar(name) {
    if (name in this.ctx) {
      return this.ctx[name];
    } else {
      throw ReferenceError;
    }
  }
}

module.exports = Context;