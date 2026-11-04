# Simple Calculator App in JavaScript

A lightweight, modern calculator application written in JavaScript featuring a sleek responsive Web UI and a command-line interface (CLI).

## Features

- **Standard Arithmetic Operations**: Addition (`+`), Subtraction (`-`), Multiplication (`×`), Division (`÷`), and Modulo (`%`).
- **Operator Precedence**: Correct evaluation honoring order of operations (`*` and `/` before `+` and `-`) and parentheses.
- **Modern Responsive Web UI**:
  - Sleek glassmorphism aesthetic with responsive keypad
  - Light / Dark theme toggle
  - Calculation history with click-to-reuse
  - Visual button feedback
  - Full keyboard shortcuts support
- **CLI Runner & REPL**:
  - Interactive REPL mode: `node cli.js`
  - Inline evaluation: `node cli.js "15 * (4 + 2)"`
- **Zero External Dependencies**: Pure vanilla JavaScript with native Node.js test runner.

---

## Getting Started

### 1. Web Application

Simply open `index.html` in any web browser:

- On Windows (PowerShell):
  ```powershell
  Start-Process index.html
  ```
- Or double-click `index.html` in your file explorer.

#### Keyboard Shortcuts:
| Key | Action |
| --- | --- |
| `0` - `9` | Enter numbers |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Arithmetic operations |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` or `c` | Clear display |
| `%` | Percentage |

---

### 2. Command Line Interface (CLI)

Run single expression evaluation:
```bash
node cli.js "25 * 4 + 10"
# Result: 110
```

Run interactive mode:
```bash
npm start
# or: node cli.js
```

---

### 3. Running Tests

Run the built-in test suite:
```bash
npm test
```
