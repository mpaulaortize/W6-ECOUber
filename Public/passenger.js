const socket = io();
let passengerName = "";

// Pantalla de login
document.getElementById("login-btn").addEventListener("click", () => {
  passengerName = document.getElementById("passenger-name").value;
  if (passengerName) {
    document.getElementById("login").style.display = "none";
    document.getElementById("available-drivers").style.display = "block";
    socket.emit("request_ride", { passengerName: passengerName });
  }
});

// Botón de solicitar viaje
document.getElementById("request-ride-btn").addEventListener("click", () => {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (origin && destination) {
    socket.emit("request_ride", {
      passengerName: passengerName,
      origin: origin,
      destination: destination,
    });
    document.getElementById("available-drivers").style.display = "none";
    document.getElementById("searching").style.display = "block";
  }
});

// Actualiza la lista de conductores disponibles
socket.on("update_available_drivers_searching", (drivers) => {
  const driversList = document.getElementById("search-results");
  driversList.innerHTML = "";
  drivers.forEach((driver) => {
    driversList.innerHTML += `<p>Conductor: ${driver.name}, Placa: ${driver.vehicle}</p>`;
  });
});

// Información del viaje aceptado
socket.on("trip_accepted", (tripData) => {
  if (tripData.passenger === passengerName) {
    document.getElementById("searching").style.display = "none";
    document.getElementById("trip-info").style.display = "block";
    document.getElementById("trip-details").innerHTML = `
      <p>ID: ${tripData.tripId}</p>
      <p>Origen: ${tripData.origin}</p>
      <p>Destino: ${tripData.destination}</p>
      <p>Conductor: ${tripData.driver}</p>
      <p>Placa: ${tripData.vehicle}</p>
      <p>Estado: ${tripData.status}</p>
    `;
  }
});

// Cuando el viaje termina, regresa a la pantalla de inicio
socket.on("trip_ended", () => {
  document.getElementById("trip-info").style.display = "none";
  document.getElementById("available-drivers").style.display = "block";
});
