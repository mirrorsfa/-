import { chartSets } from '../data/mock-data.js';

function renderChart(element, range) {
  const data = chartSets[range];

  element.innerHTML = data.labels.map((label, index) => `
    <div class="chart-day ${index === data.labels.length - 1 ? 'today' : ''}">
      <i style="height:${data.income[index]}%"></i>
      <i style="height:${data.expense[index]}%"></i>
      <span>${label}</span>
    </div>
  `).join('');
}

export function initChart() {
  const chart = document.querySelector('#barChart');
  const rangeButtons = document.querySelectorAll('.segmented button');

  rangeButtons.forEach(button => {
    button.addEventListener('click', () => {
      rangeButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderChart(chart, button.dataset.range);
    });
  });

  renderChart(chart, 'week');
}
