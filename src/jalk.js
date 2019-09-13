// Globals.
const __VERSION = "0.0.1";
const __PROMPT = "jalk> ";

// Modules.
const {parse, SyntaxError} = require('./jalk/parse.js');
const Walker = require('./jalk/walker.js');

// Readline.
const readline = require('readline');
const ri = readline.createInterface(process.stdin, process.stdout);

// Helper to display error messages.
function error(err, plen=__PROMPT.length) {
  const line = err.location.start.line;
  const col = err.location.start.column;
  const spaces = ' '.repeat(col + plen - 1);

  return '\033[1;31m' + 
         `${spaces}^\n` +
         'error:\033[0m' + 
         ` unexpected '${err.found}' at line ${line}, column ${col}.`;
}

// Print the welcome message.
console.log('\n   Welcome to Jalk, an exercise calculator.\n   Type `.help` for help.\n');

// Configure the prompt.
ri.setPrompt(__PROMPT);
ri.prompt();

// Initialize the walker (read: global scope).
const walker = new Walker();

// Add the listeners.
ri.on('line', (line) => {
  if (line.trim().length != 0) {
    if (line[0] == '.') {
      // Command processor.
      switch (line.slice(1)) {
        case 'help':
          console.log('\n Jalk is a free, open-source calculator, written as an exercise.',
                      '\n   .help     -- display this message',
                      '\n   .quit, .q -- quit from Jalk',
                      '\n   .version  -- display the Jalk version\n');
          break;

        case 'version':
          console.log(__VERSION);
          break;

        case 'quit':
        case 'q':
          ri.emit('close');
          break;

        default:
          console.log('Command not found. Sorry!');
      }
    } else {
      // Do the computation.
      try {
        const ast = parse(line);
        const res = walker.walk(ast);
        console.log(`= ${res}`);
      } catch (err) {
        if (err instanceof SyntaxError) {
          console.log(error(err));
        }
      }
    }
  }
  ri.prompt();
}).on('close', () => {
  console.log('\nBye!');
  process.exit(0);
});
