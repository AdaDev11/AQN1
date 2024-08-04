let appointments = [];

// Создаем объект с соответствием между идентификатором доктора и его именем
const doctors = {
  1: "Aliyarov Muhammed",
  2: "Qıpshaqbaev Dáwletyar",
  // Добавьте других докторов здесь
};
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

// Устанавливаем обработчик события submit для формы
document.getElementById("appointmentForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Отменяем стандартное поведение формы
  addAppointment(event); // Вызываем функцию добавления записи
});