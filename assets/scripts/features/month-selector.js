export function initMonthSelector(state, showToast) {
  const monthLabel = document.querySelector('#monthLabel');

  function render() {
    const year = state.selectedMonth.getFullYear();
    const month = state.selectedMonth.getMonth() + 1;
    monthLabel.innerHTML = `${year}年 ${month}月 <span>⌄</span>`;
  }

  function changeMonth(offset) {
    state.selectedMonth.setMonth(state.selectedMonth.getMonth() + offset);
    render();
    showToast('已切换月份（静态演示数据）');
  }

  document.querySelector('#prevMonth').addEventListener('click', () => changeMonth(-1));
  document.querySelector('#nextMonth').addEventListener('click', () => changeMonth(1));
  render();
}
