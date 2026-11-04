#!/usr/bin/env node
const readline = require('readline');
const { evaluate } = require('./calculator.js');

function printUsage() {
  console.log(`
=========================================
          Simple Calculator CLI          
=========================================
Usage:
  node cli.js "<expression>"   Evaluate expression directly
  node cli.js                  Start interactive REPL mode

Examples:
  node cli.js "12 + 4 * 3"
  node cli.js "(100 - 25) / 5"
`);
}

const args = process.argv.slice(2);

if (args.length > 0) {
  const expr = args.join(' ');
  if (expr === '-h' || expr === '--help') {
    printUsage();
    process.exit(0);
  }

  try {
    const result = evaluate(expr);
    console.log(`Result: ${result}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
} else {
  console.log('--- Simple Calculator CLI (Interactive Mode) ---');
  console.log('Type an expression (e.g. 5 + 3 * 2) or "exit" to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'calc> ',
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
      rl.close();
      return;
    }

    if (input) {
      try {
        const result = evaluate(input);
        console.log(`= ${result}`);
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
}
