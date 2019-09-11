/*
 *  This thing parses the math and generates the AST. 
 *  Written by Alexey Yurchenko in year 2019.
*/

{
  function makeType(operator) {
    switch (operator) {
      case '+': return 'AdditionNode'
      case '-': return 'SubtractionNode'
    }
  }
}

Start = 
    _ e:Expression _ 
    { return { type: 'RootNode', containing: e }; }

Expression "addition or subtraction" = 

    a:Multiplication _ op:("+"/"-") _ b:Expression
    { return { type: makeType(op), values: [a, b] }; }

  / Multiplication

Multiplication "multiplication" =
	
    a: Division _ "*" _ b:Multiplication
    { return { type: 'MultiplicationNode', values: [a, b] }; }
    
    / Division


Division "division" =
	a:Atomar _ "/" _ b:Division
    { return { type: 'DivisionNode', values: [a, b] }; }
  
  / Atomar
            
Atomar "atomar" = 

    '(' e:Expression ')' 
    { return e; }
  
  / prefix:("+"/"-") e:Expression
    { return { type: 'PrefixedNode', prefix: prefix, value: e }; }

  / Number

Number "number" = 
    ([1-9] [0-9]* / "0") 
    { return { type: 'SimpleNumber', value: text() }; }
       
_ = [ \n\t\r\v]*