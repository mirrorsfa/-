export const transactions = [
  { icon: '☕', name: '早安咖啡', category: '餐饮', account: '微信支付', time: '今天 08:42', amount: -28, color: '#fae5dd' },
  { icon: '🚕', name: '打车去公司', category: '交通', account: '支付宝', time: '今天 08:15', amount: -36.5, color: '#e4eee9' },
  { icon: '💼', name: '六月工资', category: '工资收入', account: '招商银行', time: '今天 07:30', amount: 12800, color: '#e1eee8' },
  { icon: '🥗', name: '轻食午餐', category: '餐饮', account: '微信支付', time: '昨天 12:26', amount: -46, color: '#fff0d5' },
  { icon: '🎬', name: '周末电影', category: '休闲娱乐', account: '支付宝', time: '昨天 20:10', amount: -89, color: '#ebe6f3' }
];

export const chartSets = {
  week: {
    labels: ['周二', '周三', '周四', '周五', '周六', '周日', '今天'],
    income: [18, 0, 48, 0, 65, 20, 88],
    expense: [35, 52, 28, 75, 45, 62, 38]
  },
  month: {
    labels: ['第1周', '第2周', '第3周', '第4周'],
    income: [55, 76, 48, 88],
    expense: [42, 64, 58, 37]
  },
  year: {
    labels: ['1月', '3月', '5月', '7月', '9月', '11月'],
    income: [52, 68, 62, 83, 70, 88],
    expense: [44, 51, 60, 52, 66, 48]
  }
};

export const categoryIcons = {
  餐饮: '🍜',
  交通: '🚕',
  购物: '🛍️',
  娱乐: '🎬',
  居住: '🏠'
};
