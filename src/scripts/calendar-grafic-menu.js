export function initCalendarAndChart() {
  console.log('📅 Ejecutando initCalendarAndChart');

  // Configurar calendario
  function createCalendar(year, month) {
    const calendarEl = document.getElementById('custom-calendar');
    if (!calendarEl) return;

    calendarEl.innerHTML = '';

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const monthYear = document.createElement('div');
    monthYear.textContent = `${monthNames[month]} ${year}`;
    monthYear.style.fontWeight = 'bold';

    const nav = document.createElement('div');
    nav.style.display = 'flex';
    nav.style.gap = '10px';

    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;';
    prevBtn.onclick = () => createCalendar(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;';
    nextBtn.onclick = () => createCalendar(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    header.appendChild(monthYear);
    header.appendChild(nav);
    calendarEl.appendChild(header);

    const daysHeader = document.createElement('div');
    daysHeader.className = 'calendar-body';

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    daysOfWeek.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day-header';
      dayEl.textContent = day;
      daysHeader.appendChild(dayEl);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let date = 1;
    for (let i = 0; i < 6; i++) {
      if (date > daysInMonth) break;

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          daysHeader.appendChild(emptyDay);
        } else if (date > daysInMonth) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day empty';
          daysHeader.appendChild(emptyDay);
        } else {
          const dayEl = document.createElement('div');
          dayEl.className = 'calendar-day';

          if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
          }

          dayEl.innerHTML = `<div>${date}</div>`;

          if (date === 20) {
            const event = document.createElement('div');
            event.className = 'calendar-event';
            event.textContent = 'Conferencia';
            event.title = 'Conferencia de Negocios - 10:00 AM';
            dayEl.appendChild(event);
          }

          if (date === 25) {
            const event = document.createElement('div');
            event.className = 'calendar-event';
            event.textContent = 'Reunión';
            event.title = 'Reunión de Consejo - 3:00 PM';
            dayEl.appendChild(event);
          }

          daysHeader.appendChild(dayEl);
          date++;
        }
      }
    }

    calendarEl.appendChild(daysHeader);
  }

  function createChart() {
    const container = document.getElementById('chart-container');
    if (!container) return;

    const data = [
      { label: 'Eventos', value: 25 },
      { label: 'Miembros', value: 500 },
      { label: 'Visitas', value: 1200 }
    ];

    const maxValue = Math.max(...data.map(item => item.value));
    container.innerHTML = '';

    data.forEach((item, index) => {
      const barContainer = document.createElement('div');
      barContainer.className = 'chart-bar-container';

      const bar = document.createElement('div');
      bar.className = `chart-bar chart-bar-${index + 1}`;
      bar.style.height = `${(item.value / maxValue) * 100}%`;

      const value = document.createElement('div');
      value.className = 'chart-value';
      value.textContent = item.value;

      const label = document.createElement('div');
      label.className = 'chart-label';
      label.textContent = item.label;

      bar.appendChild(value);
      barContainer.appendChild(bar);
      barContainer.appendChild(label);
      container.appendChild(barContainer);
    });
  }

  // Ejecutar ambos
  const currentDate = new Date();
  createCalendar(currentDate.getFullYear(), currentDate.getMonth());
  createChart();
}
