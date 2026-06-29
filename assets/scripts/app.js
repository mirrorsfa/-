import { appState } from './core/state.js';
import { createToast } from './core/toast.js';
import { transactions } from './data/mock-data.js';
import { initChart } from './features/chart.js';
import { initEntryDialog } from './features/entry-dialog.js';
import { initMonthSelector } from './features/month-selector.js';
import { initNavigation } from './features/navigation.js';
import { createSummary } from './features/summary.js';
import { createTransactionList } from './features/transactions.js';

const showToast = createToast(document.querySelector('#toast'));
const transactionList = createTransactionList({ transactions, state: appState });
const summary = createSummary({
  state: appState,
  onPrivacyChange: transactionList.render
});

initChart();
initNavigation(showToast);
initMonthSelector(appState, showToast);
initEntryDialog({
  state: appState,
  showToast,
  onSave(transaction) {
    transactionList.prepend(transaction);
    summary.applyTransaction(transaction);
  }
});

document.querySelector('#todayText').textContent = new Intl.DateTimeFormat('zh-CN', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}).format(new Date());
