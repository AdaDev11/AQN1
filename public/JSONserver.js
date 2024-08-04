// Функция для получения данных из JSON Server
     async function fetchAppointments() {
      try {
        const response = await fetch("http://localhost:3000/appointments");
        const data = await response.json();
        appointments = data;
        displayAppointments();
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }

    // Функция для преобразования даты в нужный формат
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Добавляем 1, так как нумерация месяцев начинается с 0
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    
    // Функция для преобразования даты в нужный формат
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Добавляем 1, так как нумерация месяцев начинается с 0
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

// Функция для добавления записи
async function addAppointment(event) {
  event.preventDefault(); // Отменяем стандартное действие формы
  const fullName = document.getElementById("fullName").value;
  const telnom = document.getElementById("telnom").value;
  const date = document.getElementById("date").value;
  const doctor = document.getElementById("doctor").value;
  const appointment = {
    fullName,
    telnom,
    date: new Date(date).toISOString(), // Преобразование даты в формат ISO 8601
    doctor,
    status: "Ожидание",
    arrivalTime: "",
  };
  try {
    const response = await fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointment),
    });
    if (!response.ok) {
      throw new Error("Ошибка при добавлении записи");
    }
    fetchAppointments(); // Получить обновленные данные после добавления записи
    document.getElementById("appointmentForm").reset();
  } catch (error) {
    console.error("Ошибка:", error);
  }
}
// Инициализация: получить и отобразить начальные данные
fetchAppointments();

// Функция для отображения записей
function displayAppointments() {
  const tableBody = document.querySelector("#appointmentsTable tbody");
  tableBody.innerHTML = ""; // Очищаем таблицу перед отображением

  appointments.forEach((appointment, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${appointment.fullName}</td>
            <td>${appointment.telnom}</td>
            <td>${formatDate(appointment.date)}</td> <!-- Преобразуем дату здесь -->
            <td>Доктор ${appointment.doctor}</td>
            <td>
              <select class="form-control" onchange="changeStatus(${index}, this)">
                <option ${appointment.status === "Ожидание" ? "selected" : ""}>Ожидание</option>
                <option ${appointment.status === "Подтверждено" ? "selected" : ""}>Подтверждено</option>
                <option ${appointment.status === "Отменено" ? "selected" : ""}>Отменено</option>
              </select>
            </td>
            <td id="arrivalTime-${index}">${appointment.arrivalTime}</td>
            <td><button class="btn btn-primary" onclick="showChangeArrivalTimeModal(${index})">Изменить время прихода</button></td>
          `;
    tableBody.appendChild(row);
  });
}

// Функция для изменения статуса записи на сервере
async function changeStatus(index, select) {
    const appointmentId = appointments[index].id; // Получаем идентификатор записи
    appointments[index].status = select.value;
    try {
      const response = await fetch(
        `http://localhost:3000/appointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointments[index]),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при изменении статуса записи");
      }
      fetchAppointments(); // Получить обновленные данные после изменения статуса
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

// Функция для отображения модального окна изменения времени прихода
function showChangeArrivalTimeModal(index) {
    $('#arrivalTimeModal').data('index', index); // Устанавливаем индекс в атрибут data-index
    $('#arrivalTimeModal').modal('show'); // Открываем модальное окно
  }
  
// Функция для сохранения времени прихода на сервере
async function saveArrivalTime() {
    const index = $('#arrivalTimeModal').data('index');
    const appointmentId = appointments[index].id; // Получаем идентификатор записи
    const arrivalTime = $('#arrivalTimeInput').val();
    if (arrivalTime) {
      appointments[index].arrivalTime = arrivalTime;
      try {
        const response = await fetch(
          `http://localhost:3000/appointments/${appointmentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(appointments[index]),
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка при указании времени прихода");
        }
        fetchAppointments(); // Получить обновленные данные после указания времени прихода
        $(`#arrivalTime-${index}`).text(arrivalTime); // Обновляем значение времени прихода в таблице записей
      } catch (error) {
        console.error("Ошибка:", error);
      }
      $('#arrivalTimeModal').modal('hide'); // Закрываем модальное окно
    } else {
      alert("Пожалуйста, укажите время прихода.");
    }
  }