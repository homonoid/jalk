/*
 *  A recursive function that iterates over the AST and interprets it.
 *  Written by Alexey Yurchenko in year 2019.
*/

function walk (ast) {
  switch (ast.type) {
    case 'RootNode':
      return walk(ast.containing);
    
    case 'AdditionNode': 
    case 'SubtractionNode': {
      const a = walk(ast.values[0]);
      const b = walk(ast.values[1]);

      return (ast.type == 'AdditionNode' ? a + b : a - b);
    }

    case 'MultiplicationNode':
    case 'DivisionNode': {
      const a = walk(ast.values[0]);
      const b = walk(ast.values[1]);
      
      return (ast.type == 'DivisionNode' ? a / b : a * b);
    }

    case 'PrefixedNode': {
      const val = walk(ast.value);

      if (ast.prefix === '+') {
        return val * 1;
      } else {
        return val * -1;
      }
    }

    case 'SimpleNumber':
      return parseInt(ast.value);
  }
}

module.exports = walk;