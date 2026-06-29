const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function fromApiTransaction(item) {
  const amount = Number(item.amount);
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    account: item.account,
    date: item.occurred_at,
    amount: item.transaction_type === 'income' ? amount : -amount,
    icon: item.icon,
    color: item.color
  };
}

function toApiTransaction(item) {
  return {
    name: item.name,
    transaction_type: item.amount > 0 ? 'income' : 'expense',
    category: item.category,
    account: item.account,
    amount: Math.abs(item.amount).toFixed(2),
    occurred_at: item.date,
    icon: item.icon,
    color: item.color
  };
}

export function createLedgerApi(baseUrl = globalThis.LEDGER_API_BASE ?? DEFAULT_API_BASE) {
  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
    } catch (error) {
      const apiError = new ApiError('无法连接数据服务，请确认后端已经启动。');
      apiError.cause = error;
      throw apiError;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = typeof body?.detail === 'string' ? body.detail : '数据服务请求失败';
      throw new ApiError(detail, response.status);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  return {
    async health() {
      return request('/health');
    },

    async listTransactions(year) {
      const items = await request(`/transactions?year=${year}&limit=500`);
      return items.map(fromApiTransaction);
    },

    async createTransaction(transaction) {
      const item = await request('/transactions', {
        method: 'POST',
        body: JSON.stringify(toApiTransaction(transaction))
      });
      return fromApiTransaction(item);
    },

    async updateTransaction(id, transaction) {
      const item = await request(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(toApiTransaction(transaction))
      });
      return fromApiTransaction(item);
    },

    async removeTransaction(id) {
      await request(`/transactions/${id}`, { method: 'DELETE' });
    },

    async getBudget(period) {
      const budget = await request(`/budgets/${period}`);
      return Number(budget.amount);
    },

    async setBudget(period, amount) {
      const budget = await request(`/budgets/${period}`, {
        method: 'PUT',
        body: JSON.stringify({ amount: Number(amount).toFixed(2) })
      });
      return Number(budget.amount);
    }
  };
}
