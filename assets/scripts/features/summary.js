import { formatMoney } from '../core/formatters.js';

export function createSummary({ state, onPrivacyChange }) {
  const toggleButton = document.querySelector('#toggleMoney');
  const sideBudget = document.querySelector('#sideBudget');
  const incomeValue = document.querySelector('#incomeValue');
  const expenseValue = document.querySelector('#expenseValue');
  const balanceValue = document.querySelector('#balanceValue');
  const moneyValues = document.querySelectorAll('.money-value');

  function render() {
    moneyValues.forEach(node => {
      node.textContent = state.isMoneyHidden
        ? '¥ ••••••'
        : formatMoney(Number(node.dataset.value));
    });
    sideBudget.textContent = state.isMoneyHidden ? '¥ ••••••' : '¥ 3,860.00';
  }

  function applyTransaction(transaction) {
    const nextIncome = Number(incomeValue.dataset.value)
      + (transaction.amount > 0 ? transaction.amount : 0);
    const nextExpense = Number(expenseValue.dataset.value)
      + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0);

    incomeValue.dataset.value = nextIncome;
    expenseValue.dataset.value = nextExpense;
    balanceValue.dataset.value = nextIncome - nextExpense;
    render();
  }

  toggleButton.addEventListener('click', () => {
    state.isMoneyHidden = !state.isMoneyHidden;
    toggleButton.classList.toggle('hidden', state.isMoneyHidden);
    toggleButton.setAttribute('aria-label', state.isMoneyHidden ? '显示金额' : '隐藏金额');
    render();
    onPrivacyChange();
  });

  render();
  return { applyTransaction };
}
