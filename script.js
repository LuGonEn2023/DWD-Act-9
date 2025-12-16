// Elementos del DOM
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
const calendarDaysElement = document.getElementById('calendar-days');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

// Nombres de meses
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Fecha inicial: Junio 2025 (según ejemplos del PDF)
let currentDate = new Date(2025, 5, 1); // Mes 5 es Junio (0-indexado)

// Array de feriados sugerido en la consigna
// Formato YYYY-MM-DD. Nota: JS cuenta los meses desde 0, pero en strings usamos formato ISO normal.
const feriados = ["2025-06-16", "2025-06-20", "2025-07-09"];

// --- FUNCIONES SOLICITADAS ---

// 1. Determinar si es bisiesto [cite: 94-96]
function esBisiesto(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 2. Marcar día actual [cite: 98-107]
function marcarDiaActual() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();

    // Solo marcamos si el calendario muestra el mes y año actual real
    if (currentDate.getMonth() === mes && currentDate.getFullYear() === anio) {
        // Buscamos el elemento que tenga el data-day igual al día de hoy
        const selector = `.day-item[data-day="${dia}"]`;
        const diaActual = document.querySelector(selector);
        if (diaActual) {
            diaActual.classList.add("calendar_day--today");
        }
    }
}

// 3. Marcar Feriados [cite: 114-120]
function marcarFeriados() {
    const dias = document.querySelectorAll(".day-item");
    dias.forEach((dia) => {
        // dataset.date viene del HTML generado abajo
        if (feriados.includes(dia.dataset.date)) {
            dia.classList.add("calendar_day--holiday");
        }
    });
}

// --- LÓGICA DE RENDERIZADO ---

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthElement.textContent = monthNames[month];
    yearElement.textContent = year;

    calendarDaysElement.innerHTML = "";

    // Días en el mes
    // El "0" en el día obtiene el último día del mes anterior, efectivamente dándonos el total de días del mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Día de la semana en que empieza el mes (0 Domingo, 1 Lunes...)
    // Ajustamos para que Lunes sea el primer día de la grilla si es necesario
    let firstDayIndex = new Date(year, month, 1).getDay();
    // Ajuste para que la semana empiece en Lunes (Lunes=1 ... Domingo=0 -> transformamos a Lunes=0... Domingo=6)
    const startDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    // Espacios vacíos antes del primer día
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarDaysElement.appendChild(emptyDiv);
    }

    // Generar los días
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        dayDiv.classList.add('day-item');
        
        // Atributos de datos necesarios para las funciones de marcado
        dayDiv.setAttribute('data-day', i);
        
        // Formatear fecha para comparar con feriados (YYYY-MM-DD)
        // Agregamos '0' a la izquierda si es menor a 10
        const formatMonth = String(month + 1).padStart(2, '0'); 
        const formatDay = String(i).padStart(2, '0');
        dayDiv.setAttribute('data-date', `${year}-${formatMonth}-${formatDay}`);

        calendarDaysElement.appendChild(dayDiv);
    }

    // Aplicar las funciones de estilo
    marcarDiaActual();
    marcarFeriados();
}

// Event Listeners para botones
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Inicializar
renderCalendar();