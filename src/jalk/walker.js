/*
 *  A recursive function that iterates over the AST and interprets it.
 *  Written by Alexey Yurchenko in year 2019.
*/

const Context = require('./context.js');

class Walker {
  constructor (context={}) {
    this.ctx = new Context(context);
  }

  walk (ast) {
    switch (ast.type) {
      case 'RootNode':
        return this.walk(ast.containing);
      
      case 'FunctionDeclarationNode': {
        const name = ast.name.value;
        const params = ast.params.map((val, idx) => val.value);
        const body = ast.body;

        this.ctx.defvar(name, (...args) => {
          if (args.length == params.length) {
            // inner context walker
            let argsobj = {};

            for (let idx in params) {
              argsobj[params[idx]] = this.walk(args[idx]);
            }

            // Functions are isolated scope boxes; 
            const inwalk = new Walker(argsobj);
            return inwalk.walk(body);
          } else {
            // TODO: argument count mismatch
            throw EvalError;
          }
        });

        break;
      }

      case 'VariableDeclarationNode': {
        let name = ast.name.value;
        let val = this.walk(ast.value);

        this.ctx.defvar(name, val);

        return val;
      }

      case 'AdditionNode': 
      case 'SubtractionNode': {
        const a = this.walk(ast.values[0]);
        const b = this.walk(ast.values[1]);

        return (ast.type == 'AdditionNode' ? a + b : a - b);
      }

      case 'MultiplicationNode':
      case 'DivisionNode': {
        const a = this.walk(ast.values[0]);
        const b = this.walk(ast.values[1]);
        
        return (ast.type == 'DivisionNode' ? a / b : a * b);
      }

      case 'PrefixedNode': {
        const val = this.walk(ast.value);

        if (ast.prefix === '+') {
          return val * 1;
        } else {
          return val * -1;
        }
      }

      case 'FunctionCallNode':
        return this.ctx.callfn(ast.name.value, ast.args);

      case 'Symbol':
        return this.ctx.getvar(ast.value)

      case 'SimpleNumber':
        return parseInt(ast.value);

      default: {
        if (Array.isArray(ast)) {
          for (let idx in ast) {
            let val = this.walk(ast[idx]);
            if (idx == ast.length - 1) return val;
          }
        }
      }
    }
  }
}

module.exports = Walker;