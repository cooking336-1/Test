document.addEventListener('DOMContentLoaded', () => {
  const previousOperandEl = document.getElementById('previousOperand');
  const currentOperandEl = document.getElementById('currentOperand');
  const keypad = document.querySelector('.keypad');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  const calculator = new Calculator();
  const history = [];

  // Theme Management
  const savedTheme = localStorage.getItem('calc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calc-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  }

  // Display Update
  function updateDisplay() {
    currentOperandEl.textContent = calculator.currentInput || '0';
    previousOperandEl.textContent = calculator.expression || '';

    // Adjust font size for long numbers
    const len = currentOperandEl.textContent.length;
    if (len > 12) {
      currentOperandEl.style.fontSize = '1.35rem';
    } else if (len > 8) {
      currentOperandEl.style.fontSize = '1.75rem';
    } else {
      currentOperandEl.style.fontSize = '2.25rem';
    }
  }

  // History Management
  function addHistory(expr, result) {
    history.unshift({ expr, result });
    if (history.length > 20) history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="empty-history">No calculations yet</div>';
      return;
    }

    historyList.innerHTML = '';
    history.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <span class="hist-expr">${escapeHtml(item.expr)}</span>
        <span class="hist-val">${escapeHtml(String(item.result))}</span>
      `;
      div.addEventListener('click', () => {
        calculator.currentInput = String(item.result);
        calculator.expression = '';
        calculator.isResult = true;
        updateDisplay();
      });
      historyList.appendChild(div);
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  clearHistoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    history.length = 0;
    renderHistory();
  });

  // Action Handlers
  function handleNumber(num) {
    calculator.appendNumber(num);
    updateDisplay();
  }

  function handleOperator(op) {
    calculator.setOperation(op);
    updateDisplay();
  }

  function handleAction(action) {
    switch (action) {
      case 'clear':
        calculator.clear();
        updateDisplay();
        break;
      case 'delete':
        calculator.delete();
        updateDisplay();
        break;
      case 'percent':
        calculator.percentage();
        updateDisplay();
        break;
      case 'toggle-sign':
        calculator.toggleSign();
        updateDisplay();
        break;
      case 'equals': {
        const fullExpr = `${calculator.expression}${calculator.currentInput}`.trim();
        try {
          const res = calculator.compute();
          if (res !== undefined) {
            addHistory(fullExpr, res);
          }
        } catch (err) {
          console.error(err);
        }
        updateDisplay();
        break;
      }
    }
  }

  // Button clicks
  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.number) {
      handleNumber(btn.dataset.number);
    } else if (btn.dataset.operator) {
      handleOperator(btn.dataset.operator);
    } else if (btn.dataset.action) {
      handleAction(btn.dataset.action);
    }
  });

  // Keyboard navigation & visual ripple/highlight
  window.addEventListener('keydown', (e) => {
    let targetButton = null;

    if (e.key >= '0' && e.key <= '9') {
      handleNumber(e.key);
      targetButton = document.querySelector(`[data-number="${e.key}"]`);
    } else if (e.key === '.') {
      handleNumber('.');
      targetButton = document.querySelector('[data-number="."]');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      handleOperator(e.key);
      targetButton = document.querySelector(`[data-operator="${e.key}"]`);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleAction('equals');
      targetButton = document.querySelector('[data-action="equals"]');
    } else if (e.key === 'Backspace') {
      handleAction('delete');
      targetButton = document.querySelector('[data-action="delete"]');
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      handleAction('clear');
      targetButton = document.querySelector('[data-action="clear"]');
    } else if (e.key === '%') {
      handleAction('percent');
      targetButton = document.querySelector('[data-action="percent"]');
    }

    if (targetButton) {
      targetButton.classList.add('pressed');
      setTimeout(() => targetButton.classList.remove('pressed'), 120);
    }
  });

  // Initial display sync
  updateDisplay();
});
