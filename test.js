const test = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide, modulo, evaluate, Calculator } = require('./calculator.js');

test('Basic arithmetic functions', () => {
  assert.equal(add(5, 3), 8);
  assert.equal(subtract(10, 4), 6);
  assert.equal(multiply(7, 6), 42);
  assert.equal(divide(20, 4), 5);
  assert.equal(modulo(17, 5), 2);
});

test('Division by zero throws error', () => {
  assert.throws(() => divide(10, 0), /Division by zero/);
  assert.throws(() => modulo(10, 0), /Division by zero/);
  assert.throws(() => evaluate('10 / 0'), /Division by zero/);
});

test('Expression evaluation with operator precedence', () => {
  assert.equal(evaluate('2 + 3 * 4'), 14);
  assert.equal(evaluate('(2 + 3) * 4'), 20);
  assert.equal(evaluate('100 - 50 / 2 + 10'), 85);
  assert.equal(evaluate('12 + 6 / 3 - 4 * 2'), 6);
});

test('Expression evaluation with decimals and floats', () => {
  assert.equal(evaluate('0.1 + 0.2'), 0.3);
  assert.equal(evaluate('1.5 * 3'), 4.5);
  assert.equal(evaluate('7 / 2'), 3.5);
});

test('Expression evaluation with negative numbers', () => {
  assert.equal(evaluate('-5 + 12'), 7);
  assert.equal(evaluate('10 + -3'), 7);
});

test('Calculator state machine', () => {
  const calc = new Calculator();
  assert.equal(calc.currentInput, '0');

  // Input 25
  calc.appendNumber('2');
  calc.appendNumber('5');
  assert.equal(calc.currentInput, '25');

  // Plus 15
  calc.setOperation('+');
  calc.appendNumber('1');
  calc.appendNumber('5');
  calc.compute();
  assert.equal(calc.currentInput, '40');

  // Toggle sign
  calc.toggleSign();
  assert.equal(calc.currentInput, '-40');

  // Percentage
  calc.percentage();
  assert.equal(calc.currentInput, '-0.4');

  // Clear
  calc.clear();
  assert.equal(calc.currentInput, '0');
  assert.equal(calc.expression, '');

  // Delete / Backspace
  calc.appendNumber('1');
  calc.appendNumber('2');
  calc.appendNumber('3');
  calc.delete();
  assert.equal(calc.currentInput, '12');
});
