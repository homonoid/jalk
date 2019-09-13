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
	nodes:Node*
    { return { type: 'RootNode', containing: nodes }; }

Node = 
    _ e:(Variable / Expression) _ 
    { return e }

Variable "variable declaration" = 
	
    name:Symbol _ "=" _ val:Expression
    { return { type: 'VariableDeclarationNode', name: name, value: val }; }

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

    '(' _ e:Expression _ ')' 
    { return e; }
  
  / prefix:("+"/"-") e:Expression
    { return { type: 'PrefixedNode', prefix: prefix, value: e }; }

  / Symbol
  / Number

Number "number" = 
    ([1-9] [0-9]* / "0") 
    { return { type: 'SimpleNumber', value: text() }; }
       
Symbol "symbol" =
	
    [a-z] [A-Za-z0-9_]*
    { return { type: 'Symbol', value: text() }; }

_ = [ \n\t\r\v]*