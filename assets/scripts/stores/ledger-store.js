import { toMonthKey } from '../core/date.js';

function createId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `transaction-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createLedgerStore({ storage, seedData, initialMonth, gateway = null }) {
  const persisted = storage.load(seedData);
  const listeners = new Set();
  const state = {
    transactions: persisted.transactions,
    budgets: persisted.budgets,
    selectedMonth: initialMonth,
    isMoneyHidden: false,
    chartRange: 'week',
    dataSource: gateway ? 'connecting' : 'local',
    isLoading: Boolean(gateway),
    error: null
  };

  function persist() {
    storage.save({ transactions: state.transactions, budgets: state.budgets });
  }

  function notify() {
    listeners.forEach(listener => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  }

  async function loadRemoteYear() {
    if (!gateway || state.dataSource !== 'remote') return;
    const year = state.selectedMonth.getFullYear();
    state.isLoading = true;
    state.error = null;
    notify();
    try {
      const [transactions, budget] = await Promise.all([
        gateway.listTransactions(year),
        gateway.getBudget(toMonthKey(state.selectedMonth))
      ]);
      state.transactions = transactions;
      state.budgets[toMonthKey(state.selectedMonth)] = budget;
      persist();
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  async function initialize() {
    if (!gateway) return;
    try {
      await gateway.health();
      state.dataSource = 'remote';
      await loadRemoteYear();
    } catch (error) {
      state.dataSource = 'local';
      state.isLoading = false;
      state.error = error.message;
      notify();
    }
  }

  async function addTransaction(transaction) {
    state.isLoading = true;
    notify();
    try {
      const created = state.dataSource === 'remote'
        ? await gateway.createTransaction(transaction)
        : { ...transaction, id: createId() };
      state.transactions.unshift(created);
      state.error = null;
      persist();
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  async function updateTransaction(id, changes) {
    const existing = state.transactions.find(item => item.id === id);
    if (!existing) return;
    state.isLoading = true;
    notify();
    try {
      const updated = state.dataSource === 'remote'
        ? await gateway.updateTransaction(id, { ...existing, ...changes })
        : { ...existing, ...changes, id };
      state.transactions = state.transactions.map(item => item.id === id ? updated : item);
      state.error = null;
      persist();
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  async function removeTransaction(id) {
    state.isLoading = true;
    notify();
    try {
      if (state.dataSource === 'remote') await gateway.removeTransaction(id);
      state.transactions = state.transactions.filter(item => item.id !== id);
      state.error = null;
      persist();
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  async function changeMonth(offset) {
    const previousYear = state.selectedMonth.getFullYear();
    state.selectedMonth = new Date(
      previousYear,
      state.selectedMonth.getMonth() + offset,
      1
    );
    notify();
    if (state.dataSource !== 'remote') return;

    if (state.selectedMonth.getFullYear() !== previousYear) {
      await loadRemoteYear();
      return;
    }
    state.isLoading = true;
    notify();
    try {
      state.budgets[toMonthKey(state.selectedMonth)] = await gateway.getBudget(
        toMonthKey(state.selectedMonth)
      );
      persist();
    } catch (error) {
      state.error = error.message;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  function setMoneyHidden(hidden) {
    state.isMoneyHidden = hidden;
    notify();
  }

  function setChartRange(range) {
    state.chartRange = range;
    notify();
  }

  async function setBudget(amount) {
    const period = toMonthKey(state.selectedMonth);
    state.isLoading = true;
    notify();
    try {
      state.budgets[period] = state.dataSource === 'remote'
        ? await gateway.setBudget(period, amount)
        : amount;
      state.error = null;
      persist();
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.isLoading = false;
      notify();
    }
  }

  return {
    getState: () => state,
    subscribe,
    initialize,
    addTransaction,
    updateTransaction,
    removeTransaction,
    changeMonth,
    setMoneyHidden,
    setChartRange,
    setBudget
  };
}
