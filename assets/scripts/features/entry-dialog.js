import { categoryIcons } from '../data/mock-data.js';

export function initEntryDialog({ state, onSave, showToast }) {
  const dialog = document.querySelector('#transactionDialog');
  const form = document.querySelector('#transactionForm');
  const amountInput = document.querySelector('#amountInput');
  const noteInput = document.querySelector('#noteInput');
  const typeButtons = document.querySelectorAll('.type-switch button');
  const categoryButtons = document.querySelectorAll('.category-options button');

  function open() {
    dialog.showModal();
    window.setTimeout(() => amountInput.focus(), 120);
  }

  document.querySelector('#addTransaction').addEventListener('click', open);
  document.querySelector('#mobileAdd').addEventListener('click', open);
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());

  typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.transactionType = button.dataset.type;
      typeButtons.forEach(item => item.classList.toggle('active', item === button));
    });
  });

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCategory = button.dataset.category;
      categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      amountInput.focus();
      showToast('先写下正确的金额吧');
      return;
    }

    const isIncome = state.transactionType === 'income';
    onSave({
      icon: isIncome ? '💰' : categoryIcons[state.selectedCategory],
      name: noteInput.value.trim() || (isIncome ? '一笔新收入' : state.selectedCategory),
      category: isIncome ? '其他收入' : state.selectedCategory,
      account: '默认账户',
      time: '刚刚',
      amount: isIncome ? amount : -amount,
      color: isIncome ? '#e1eee8' : '#fae5dd'
    });

    form.reset();
    dialog.close();
    showToast('已保存，认真生活的证据 +1');
  });

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
