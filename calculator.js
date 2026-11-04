/**
 * Core Calculator Logic & Expression Evaluator
 * Supports basic arithmetic (+, -, *, /, %) with operator precedence and parentheses.
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a % b;
}

/**
 * Tokenize a math expression string into tokens.
 */
function tokenize(expression) {
  const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
  const tokens = [];
  let i = 0;

  while (i < sanitized.length) {
    const char = sanitized[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number (including decimals)
    if (/\d/.test(char) || char === '.') {
      let numStr = '';
      while (i < sanitized.length && (/[\d.]/.test(sanitized[i]))) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(numStr) });
      continue;
    }

    // Unary minus handling: if '-' follows an operator or is at start
    if (char === '-') {
      const prev = tokens[tokens.length - 1];
      const isUnary = !prev || prev.type === 'operator' || (prev.type === 'paren' && prev.value === '(');
      if (isUnary) {
        // Look ahead for number
        let nextIndex = i + 1;
        while (nextIndex < sanitized.length && /\s/.test(sanitized[nextIndex])) nextIndex++;
        if (nextIndex < sanitized.length && (/[\d.]/.test(sanitized[nextIndex]))) {
          let numStr = '-';
          i = nextIndex;
          while (i < sanitized.length && (/[\d.]/.test(sanitized[i]))) {
            numStr += sanitized[i];
            i++;
          }
          tokens.push({ type: 'number', value: parseFloat(numStr) });
          continue;
        }
      }
    }

    if (['+', '-', '*', '/', '%'].includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      i++;
      continue;
    }

    throw new Error(`Invalid character: '${char}'`);
  }

  return tokens;
}

/**
 * Evaluates an infix expression safely using Shunting-Yard algorithm (Reverse Polish Notation).
 */
function evaluate(expression) {
  if (!expression || typeof expression !== 'string' || !expression.trim()) {
    return 0;
  }

  const tokens = tokenize(expression);
  if (tokens.length === 0) return 0;

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
  };

  const outputQueue = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      outputQueue.push(token);
    } else if (token.type === 'operator') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'operator' &&
        precedence[operatorStack[operatorStack.length - 1].value] >= precedence[token.value]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token.type === 'paren' && token.value === '(') {
      operatorStack.push(token);
    } else if (token.type === 'paren' && token.value === ')') {
      let foundMatching = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top.type === 'paren' && top.value === '(') {
          foundMatching = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!foundMatching) {
        throw new Error('Mismatched parentheses');
      }
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op.type === 'paren') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack = [];
  for (const token of outputQueue) {
    if (token.type === 'number') {
      evalStack.push(token.value);
    } else if (token.type === 'operator') {
      if (evalStack.length < 2) {
        throw new Error('Invalid expression syntax');
      }
      const b = evalStack.pop();
      const a = evalStack.pop();
      let result;
      switch (token.value) {
        case '+':
          result = add(a, b);
          break;
        case '-':
          result = subtract(a, b);
          break;
        case '*':
          result = multiply(a, b);
          break;
        case '/':
          result = divide(a, b);
          break;
        case '%':
          result = modulo(a, b);
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
      evalStack.push(result);
    }
  }

  if (evalStack.length !== 1) {
    throw new Error('Invalid expression');
  }

  // Round floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004)
  const finalVal = evalStack[0];
  return Math.round((finalVal + Number.EPSILON) * 1e10) / 1e10;
}

/**
 * Stateful Calculator class for step-by-step UI / interactive use.
 */
class Calculator {
  constructor() {
    this.clear();
  }

  clear() {
    this.currentInput = '0';
    this.expression = '';
    this.isResult = false;
  }

  delete() {
    if (this.isResult) {
      this.clear();
      return;
    }
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
  }

  appendNumber(number) {
    if (this.isResult) {
      this.currentInput = '';
      this.isResult = false;
    }
    if (number === '.' && this.currentInput.includes('.')) return;
    if (this.currentInput === '0' && number !== '.') {
      this.currentInput = String(number);
    } else {
      this.currentInput = `${this.currentInput}${number}`;
    }
  }

  setOperation(op) {
    const symbolMap = { '+': '+', '-': '-', '*': '*', '/': '/', '%': '%' };
    const normalized = symbolMap[op] || op;

    if (this.currentInput === '' && this.expression !== '') {
      // Replace last operator
      this.expression = this.expression.replace(/[\+\-\*\/\%]\s*$/, `${normalized} `);
      return;
    }

    this.expression = `${this.expression}${this.currentInput} ${normalized} `;
    this.currentInput = '';
    this.isResult = false;
  }

  toggleSign() {
    if (this.currentInput === '0' || this.currentInput === '') return;
    if (this.currentInput.startsWith('-')) {
      this.currentInput = this.currentInput.slice(1);
    } else {
      this.currentInput = '-' + this.currentInput;
    }
  }

  percentage() {
    if (this.currentInput === '' || this.currentInput === '0') return;
    const val = parseFloat(this.currentInput);
    this.currentInput = String(val / 100);
  }

  compute() {
    if (this.currentInput === '' && this.expression === '') return;
    const fullExpr = `${this.expression}${this.currentInput}`.trim();
    if (!fullExpr) return;

    try {
      const result = evaluate(fullExpr);
      this.expression = `${fullExpr} =`;
      this.currentInput = String(result);
      this.isResult = true;
      return result;
    } catch (err) {
      this.expression = fullExpr;
      this.currentInput = 'Error';
      this.isResult = true;
      throw err;
    }
  }
}

// Module export for Node.js, and global attachment for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add,
    subtract,
    multiply,
    divide,
    modulo,
    evaluate,
    tokenize,
    Calculator,
  };
}

if (typeof window !== 'undefined') {
  window.Calculator = Calculator;
  window.evaluate = evaluate;
}
