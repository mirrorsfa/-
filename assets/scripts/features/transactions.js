import { escapeHtml, formatMoney } from '../core/formatters.js';

export function createTransactionList({ transactions, state }) {
  const list = document.querySelector('#transactionList');
  const emptyState = document.querySelector('#emptyState');
  const searchInput = document.querySelector('#searchInput');

  function filter(query = '') {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return transactions;

    return transactions.filter(item =>
      [item.name, item.category, item.account]
        .some(value => value.toLowerCase().includes(keyword))
    );
  }

  function render() {
    const visibleTransactions = filter(searchInput.value);

    list.innerHTML = visibleTransactions.map(item => `
      <div class="transaction-item">
        <div class="transaction-icon" style="--icon-bg:${item.color}">${item.icon}</div>
        <div class="transaction-name">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.category)}</small>
        </div>
        <span class="transaction-account">${escapeHtml(item.account)}</span>
        <time class="transaction-time">${escapeHtml(item.time)}</time>
        <span class="transaction-amount ${item.amount > 0 ? 'income' : ''}">
          ${state.isMoneyHidden ? '••••••' : formatMoney(item.amount, true)}
        </span>
      </div>
    `).join('');

    emptyState.hidden = visibleTransactions.length > 0;
  }

  function prepend(transaction) {
    transactions.unshift(transaction);
    render();
  }

  searchInput.addEventListener('input', () => {
    render();
    document.querySelector('#transactions').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });

  render();
  return { prepend, render };
}
