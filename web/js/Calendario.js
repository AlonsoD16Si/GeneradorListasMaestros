// Obtiene la fecha actual
const currentDate = new Date();
// Obtiene el mes actual (0-11)
let currentMonth = currentDate.getMonth();
// Obtiene el año actual
let currentYear = currentDate.getFullYear();
// Inicializa las fechas de inicio y fin como nulas
let startDate = null;
let endDate = null;

// Obtiene el cuerpo del calendario y el elemento que muestra el mes actual
const calendarBody = document.getElementById('calendarBody');
const currentMonthElement = document.getElementById('currentMonth');

// Nuevas referencias para el input y el botón del periodo
const dateRangeInput = document.getElementById('dateRangeInput');
const openCalendarBtn = document.getElementById('openCalendarBtn');
const calendarContainer = document.getElementById('calendarContainer');

// Botón para cerrar el calendario
const closeCalendarBtn = document.getElementById("closeCalendarBtn");

// Función para alternar la visibilidad del calendario
function toggleCalendar(calendarId, openBtnId, closeBtnId) {
    // Obtiene el contenedor del calendario y los botones
    const calendarContainer = document.getElementById(calendarId);
    const openCalendarBtn = document.getElementById(openBtnId);
    const closeCalendarBtn = document.getElementById(closeBtnId);

    // Si el calendario está oculto, lo muestra
    if (calendarContainer.style.display === "none" || !calendarContainer.style.display) {
        calendarContainer.style.display = "block"; // Muestra el calendario
        openCalendarBtn.style.display = "none"; // Oculta el botón de abrir
        closeCalendarBtn.style.display = "block"; // Muestra el botón de cerrar
    } else {
        // Si el calendario está visible, lo oculta
        calendarContainer.style.display = "none"; // Oculta el calendario
        openCalendarBtn.style.display = "block"; // Muestra el botón de abrir
        closeCalendarBtn.style.display = "none"; // Oculta el botón de cerrar
    }
}

// Inicializa el calendario y los eventos
function initializeCalendar(parcial) {
    // Añade evento para abrir el calendario del parcial
    document.getElementById(`openCalendarBtnParcial${parcial}`).addEventListener("click", () => {
        toggleCalendar(`calendarContainerParcial${parcial}`, `openCalendarBtnParcial${parcial}`, `closeCalendarBtnParcial${parcial}`);
    });

    // Añade evento para cerrar el calendario del parcial
    document.getElementById(`closeCalendarBtnParcial${parcial}`).addEventListener("click", () => {
        toggleCalendar(`calendarContainerParcial${parcial}`, `openCalendarBtnParcial${parcial}`, `closeCalendarBtnParcial${parcial}`);
    });

    // Añade evento para manejar la selección de fechas
    document.getElementById(`dateRangeInputParcial${parcial}`).addEventListener("input", () => {
        handleDateSelection(`dateRangeInputParcial${parcial}`, `openCalendarBtnParcial${parcial}`);
    });
}

// Inicializa todos los parciales
initializeCalendar(1);
initializeCalendar(2);
initializeCalendar(3);

// Evento para abrir el calendario principal
openCalendarBtn.addEventListener("click", toggleCalendar);

// Evento para cerrar el calendario principal
closeCalendarBtn.addEventListener("click", toggleCalendar);

// Evento para navegar al mes anterior
prevBtn.addEventListener('click', () => {
    currentMonth--; // Decrementa el mes actual
    renderCalendar(); // Renderiza el calendario actualizado
});

// Evento para navegar al mes siguiente
nextBtn.addEventListener('click', () => {
    currentMonth++; // Incrementa el mes actual
    renderCalendar(); // Renderiza el calendario actualizado
});

// Evento para abrir el calendario al hacer clic en el botón
openCalendarBtn.addEventListener('click', () => {
    calendarContainer.style.display = 'block'; // Muestra el calendario
});

// Función para renderizar el calendario
function renderCalendar() {
    // Obtiene la cantidad de días en el mes actual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Obtiene el índice del primer día del mes actual
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    // Muestra el mes y año actual en el elemento correspondiente
    currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' });

    let days = ''; // Inicializa la cadena para los días del calendario

    // Agrega espacios vacíos para los días antes del primer día del mes
    for (let i = 0; i < firstDayIndex; i++) {
        days += `<div class="calendar-day"></div>`;
    }

    // Agrega los días del mes al calendario
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const className = getDayClassName(date); // Obtiene la clase para el día
        // Agrega cada día como un div clickeable
        days += `<div class="calendar-day ${className}" onclick="selectDate(${i})">${i}</div>`;
    }

    // Inserta los días en el cuerpo del calendario
    calendarBody.innerHTML = days;
}

// Función para seleccionar una fecha
function selectDate(day) {
    const clickedDate = new Date(currentYear, currentMonth, day); // Crea un objeto de fecha para el día seleccionado
    if (!startDate || endDate) {
        startDate = clickedDate; // Establece la fecha de inicio
        endDate = null; // Reinicia la fecha de fin
    } else if (clickedDate < startDate) {
        startDate = clickedDate; // Cambia la fecha de inicio si se selecciona una fecha anterior
    } else if (clickedDate > startDate) {
        endDate = clickedDate; // Establece la fecha de fin
    }

    renderCalendar(); // Renderiza el calendario nuevamente
    updateSelectedDates(); // Actualiza el input de rango de fechas

    // Cierra el calendario si se ha seleccionado un rango completo
    if (startDate && endDate) {
        calendarContainer.style.display = 'none'; // Oculta el calendario
    }
}

// Función para actualizar las fechas seleccionadas en el input
function updateSelectedDates() {
    if (startDate && endDate) {
        dateRangeInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`; // Muestra el rango de fechas completo
    } else if (startDate) {
        dateRangeInput.value = `${formatDate(startDate)} -`; // Muestra solo la fecha de inicio
    } else {
        dateRangeInput.value = ''; // Si no hay fechas seleccionadas, se limpia el input
    }
}

// Función para obtener la clase del día
function getDayClassName(date) {
    if (startDate && date.toDateString() === startDate.toDateString()) {
        return 'selected'; // Clase para el día de inicio seleccionado
    }
    if (endDate && date.toDateString() === endDate.toDateString()) {
        return 'selected'; // Clase para el día de fin seleccionado
    }
    if (startDate && endDate && date > startDate && date < endDate) {
        return 'range'; // Clase para los días dentro del rango seleccionado
    }
    return ''; // Sin clase para días que no están seleccionados
}

// Función para formatear la fecha en formato DD/MM/YYYY
function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Inicializa el calendario del periodo
renderCalendar(); // Renderiza el calendario inicialmente
updateSelectedDates(); // Actualiza las fechas seleccionadas

// Funciones para los parciales
const parcialCalendars = [
    {
        startDate: null, // Fecha de inicio del parcial
        endDate: null, // Fecha de fin del parcial
        currentMonth: currentMonth, // Mes actual del parcial
        currentYear: currentYear, // Año actual del parcial
        calendarBody: document.getElementById('calendarBodyParcial1'), // Cuerpo del calendario del parcial
        currentMonthElement: document.getElementById('currentMonthParcial1'), // Elemento que muestra el mes actual del parcial
        dateRangeInput: document.getElementById('dateRangeInputParcial1'), // Input para el rango de fechas del parcial
        calendarContainer: document.getElementById('calendarContainerParcial1'), // Contenedor del calendario del parcial
        openButton: document.getElementById('openCalendarBtnParcial1'), // Botón para abrir el calendario del parcial
        prevButton: document.getElementById('prevBtnParcial1'), // Botón para ir al mes anterior del parcial
        nextButton: document.getElementById('nextBtnParcial1') // Botón para ir al mes siguiente del parcial
    },
    {
        startDate: null,
        endDate: null,
        currentMonth: currentMonth,
        currentYear: currentYear,
        calendarBody: document.getElementById('calendarBodyParcial2'),
        currentMonthElement: document.getElementById('currentMonthParcial2'),
        dateRangeInput: document.getElementById('dateRangeInputParcial2'),
        calendarContainer: document.getElementById('calendarContainerParcial2'),
        openButton: document.getElementById('openCalendarBtnParcial2'),
        prevButton: document.getElementById('prevBtnParcial2'),
        nextButton: document.getElementById('nextBtnParcial2')
    },
    {
        startDate: null,
        endDate: null,
        currentMonth: currentMonth,
        currentYear: currentYear,
        calendarBody: document.getElementById('calendarBodyParcial3'),
        currentMonthElement: document.getElementById('currentMonthParcial3'),
        dateRangeInput: document.getElementById('dateRangeInputParcial3'),
        calendarContainer: document.getElementById('calendarContainerParcial3'),
        openButton: document.getElementById('openCalendarBtnParcial3'),
        prevButton: document.getElementById('prevBtnParcial3'),
        nextButton: document.getElementById('nextBtnParcial3')
    }
];

// Inicializar cada calendario de parcial
parcialCalendars.forEach((calendar) => {
    calendar.openButton.addEventListener('click', () => {
        calendar.calendarContainer.style.display = 'block';
        renderParcialCalendar(calendar);
    });

    calendar.prevButton.addEventListener('click', () => {
        calendar.currentMonth--;
        renderParcialCalendar(calendar);
    });

    calendar.nextButton.addEventListener('click', () => {
        calendar.currentMonth++;
        renderParcialCalendar(calendar);
    });
});

function renderParcialCalendar(calendar) {
    const daysInMonth = new Date(calendar.currentYear, calendar.currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendar.currentYear, calendar.currentMonth, 1).getDay();

    calendar.currentMonthElement.textContent = new Date(calendar.currentYear, calendar.currentMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' });

    let days = '';

    for (let i = 0; i < firstDayIndex; i++) {
        days += `<div class="calendar-day"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(calendar.currentYear, calendar.currentMonth, i);
        const className = getParcialDayClassName(date, calendar);
        days += `<div class="calendar-day ${className}" onclick="selectParcialDate(${calendar.currentMonth}, ${calendar.currentYear}, ${i})">${i}</div>`;
    }

    calendar.calendarBody.innerHTML = days;
}

function selectParcialDate(month, year, day) {
    const clickedDate = new Date(year, month, day);

    // Check if the clicked date is within the period range
    if (startDate && endDate) {
        if (clickedDate < startDate || clickedDate > endDate) {
            Swal.fire('La fecha seleccionada debe estar dentro del rango del periodo.');
            return;
        }
    } else {
        Swal.fire('Por favor, seleccione primero el rango del periodo.');
        return;
    }

    const calendar = parcialCalendars.find(cal => cal.currentMonth === month && cal.currentYear === year);

    if (!calendar.startDate || calendar.endDate) {
        calendar.startDate = clickedDate;
        calendar.endDate = null;
    } else if (clickedDate < calendar.startDate) {
        calendar.startDate = clickedDate;
    } else if (clickedDate > calendar.startDate) {
        calendar.endDate = clickedDate;
    }

    renderParcialCalendar(calendar);
    updateParcialSelectedDates(calendar);

    // Cerrar el calendario si se ha seleccionado un rango completo
    if (calendar.startDate && calendar.endDate) {
        calendar.calendarContainer.style.display = 'none';
    }
}

function updateParcialSelectedDates(calendar) {
    if (calendar.startDate && calendar.endDate) {
        calendar.dateRangeInput.value = `${formatDate(calendar.startDate)} - ${formatDate(calendar.endDate)}`;
    } else if (calendar.startDate) {
        calendar.dateRangeInput.value = `${formatDate(calendar.startDate)} -`;
    } else {
        calendar.dateRangeInput.value = '';
    }
}

function getParcialDayClassName(date, calendar) {
    if (calendar.startDate && date.toDateString() === calendar.startDate.toDateString()) {
        return 'selected';
    }
    if (calendar.endDate && date.toDateString() === calendar.endDate.toDateString()) {
        return 'selected';
    }
    if (calendar.startDate && calendar.endDate && date > calendar.startDate && date < calendar.endDate) {
        return 'range';
    }
    return '';
}
// Validar horas de trabajo por día
function validarHoras(input) {
    input.value = input.value.replace(/[^\d]/g, ''); // Solo permite dígitos
    let valor = parseInt(input.value);
    if (!isNaN(valor) && valor > 8) { // Solo muestra alerta si es mayor a 8
        input.value = ''; // Limpia el input
        Swal.fire('Las horas no deben ser mayores a 8');
    }
}

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function() {
        validarHoras(this); 
    });
});

// Validar cantidad de alumnos
function cantidadAlumnos(input) {
    input.value = input.value.replace(/[^\d]/g, ''); 
    let valor = parseInt(input.value);
    if (!isNaN(valor) && valor > 30) { 
        input.value = '';
        Swal.fire('La cantidad de alumnos no debe ser mayor a 30');
    }
}

document.querySelector('#cantidadalumnos').addEventListener('input', function() {
    cantidadAlumnos(this); // Valida cantidad de alumnos
});


// Inicializar el calendario del periodo
renderCalendar();
updateSelectedDates();


function obtenerDatos() {
    let horasLunes = document.getElementById("lunes").value;
    let horasMartes = document.getElementById("martes").value;
    let horasMiercoles = document.getElementById("miercoles").value;
    let horasJueves = document.getElementById("jueves").value;
    let horasViernes = document.getElementById("viernes").value;
    let horasSabado = document.getElementById("sabado").value;
//    let profesor = document.getElementById("nombre").value;
//    let materia = document.getElementById("materia").value;
//    let alumnos = parseInt(document.getElementById("cantidadalumnos").values);
    let diaFestivo1 = document.getElementById("dia-festivo-1").value;
    let diaFestivo2 = document.getElementById("dia-festivo-2").value;
    let diaFestivo3 = document.getElementById("dia-festivo-3").value;
    let diaFestivo4 = document.getElementById("dia-festivo-4").value;
    let diaFestivo5 = document.getElementById("dia-festivo-5").value;
    let inicioVacaciones = document.getElementById("inicio-vacaciones-1").value;
    let finVacaciones = document.getElementById("fin-vacaciones-1").value;
    let cont;
    
    let vacaciones = inicioVacaciones + " - " + finVacaciones;

    let periodoFechas = document.getElementById('dateRangeInput').value;
    periodoFechas = periodoFechas.split(' - ');

// Extrae la fecha de inicio y la fecha de fin
    let periodoInicio = periodoFechas[0];  // Primera fecha
    let periodoFin = periodoFechas[1];     // Segunda fecha

    let parcial1 = document.getElementById('dateRangeInputParcial1').value;
    parcial1 = parcial1.split(' - ');
    let parcial1Inicio = parcial1[0];
    let parcial1Fin = parcial1[1];

    let parcial2 = document.getElementById('dateRangeInputParcial2').value;
    parcial2 = parcial2.split(' - ');
    let parcial2Inicio = parcial2[0];
    let parcial2Fin = parcial2[1];

    let parcial3 = document.getElementById('dateRangeInputParcial3').value;
    parcial3 = parcial3.split(' - ');
    let parcial3Inicio = parcial3[0];
    let parcial3Fin = parcial3[1];


    //Parcear las fechas a formato fecha
    periodoInicio = parseDate(periodoInicio);
    periodoFin = parseDate(periodoFin);
    parcial1Inicio = parseDate(parcial1Inicio);
    parcial2Inicio = parseDate(parcial2Inicio);
    parcial3Inicio = parseDate(parcial3Inicio);
    parcial1Fin = parseDate(parcial1Fin);
    parcial2Fin = parseDate(parcial2Fin);
    parcial3Fin = parseDate(parcial3Fin);
    if(diaFestivo1 ===! 0){
        diaFestivo1 = parseDate(diaFestivo1);
        cont++;
    }
    if(diaFestivo2 ===! 0){
        diaFestivo2 = parseDate(diaFestivo2);
        cont++;
    }
    if(diaFestivo3 ===! 0){
        diaFestivo3 = parseDate(diaFestivo3);
        cont++;
    }
    if(diaFestivo4 ===! 0){
        diaFestivo4 = parseDate(diaFestivo4);
        cont++;
    }
    if(diaFestivo5 ===! 0){
        diaFestivo5 = parseDate(diaFestivo5);
        cont++;
    }
    
    inicioVacaciones=parseDate(inicioVacaciones);
    finVacaciones = parseDate(finVacaciones);
    
    
    
    

    document.getElementById("idPeriodo").innerHTML=periodoFechas;
    document.getElementById("idLunes").innerHTML=horasLunes;
    document.getElementById("idMartes").innerHTML=horasMartes;
    document.getElementById("idMiercoles").innerHTML=horasMiercoles;
    document.getElementById("idJueves").innerHTML=horasJueves;
    document.getElementById("idViernes").innerHTML=horasViernes;
    document.getElementById("idSabado").innerHTML=horasSabado;
    document.getElementById("idFestivos").innerHTML=cont;
    document.getElementById("idVacaciones").innerHTML=vacaciones;
    
//    let tablaHTML = `
//                <table class="table table-striped table-bordered">
//                    <thead class="table-dark">
//                        <tr>
//                            <th>ID</th>
//                            <th>Nombre</th>
//                            <th>Edad</th>
//                            <th>Ciudad</th>
//                        </tr>
//                    </thead>
//                    <tbody>
//            `;

//    //Mientras la fecha sea menor o igual a la fecha final se hace el proceso
//    while (periodoInicio <= periodoFin) {
//        // Mientras la fecha este fuera del periodo vacacional
//        if (periodoInicio < periodoVacacionesInicio|| periodoInicio > periodoVacacionesFin) {
//            // y mientras la fecha no sea igual a los dias feriados
//            if (periodoInicio !== diaFeriado1 && periodoInicio !== diaFeriado2 && periodoInicio !== diaFeriado3 && periodoInicio !== diaFeriado4 && periodoInicio !== diaFeriado5) {
//                //Vas a obtener el dia de la semana con letra
//                diaSemana = obtenerDiaDeLaSemana(fechaInicio);
//
//                //Si el dia de la semana es lunes
//                if (diaSemana.equals("Lunes")) {
//                    //Y mientas el contador sea menor o igual al numero de horas de ese dia
//                    while (cont <= horasLunes) {
//                        //vas a hacer este proceso
//
//                        //Sumas 1 al contador
//                        cont++;
//                    }
//                }
//                if (diaSemana.equals("Martes")) {
//
//                }
//                if (diaSemana.equals("Miércoles")) {
//
//                }
//                if (diaSemana.equals("Jueves")) {
//
//                }
//                if (diaSemana.equals("Viernes")) {
//
//                }
//                if (diaSemana.equals("Sábado")) {
//
//                }
//            }
//        }
//
//        fechaInicio.setDate(fechaInicio.getDate() + 1);
//    }
}



function parseDate(fechaString) {
    // Divide la cadena en día, mes y año
    const [dia, mes, año] = fechaString.split('/').map(Number); // Usa map(Number) para convertir a números

    // Crea un objeto Date. En JavaScript, los meses empiezan desde 0 (Enero es 0, Diciembre es 11)
    return new Date(año, mes - 1, dia);  // Restamos 1 al mes porque los meses son de 0 a 11
}

function obtenerDiaDeLaSemana(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[fecha.getDay()];
    const diaSemana = obtenerDiaDeLaSemana(fecha);
}