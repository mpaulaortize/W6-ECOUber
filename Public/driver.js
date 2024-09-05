const socket = io();
let driverName = "";
let selectedVehicle = "";
let currentTripId = "";

// Pantalla de login
document.getElementById("login-btn").addEventListener("click", () => {
  driverName = document.getElementById("driver-name").value;
  if (driverName) {
    document.getElementById("login").style.display = "none";
    document.getElementById("vehicle-selection").style.display = "block";
  }
});

// Pantalla de selección de vehículo
document.getElementById("next-btn").addEventListener("click", () => {
  selectedVehicle = document.getElementById("vehicle-select").value;
  if (selectedVehicle) {
    document.getElementById("vehicle-selection").style.display = "none";
    document.getElementById("trip-info").style.display = "block";
    socket.emit("activate_driver", {
      name: driverName,
      vehicle: selectedVehicle,
    });
  }
});

// Botón de activar vehículo
document.getElementById("activate-btn").addEventListener("click", () => {
  const tripData = {
    tripId: Math.random().toString(36).substr(2, 9),
    origin: "Pickup Location", // Placeholder
    destination: "Dropoff Location", // Placeholder
    driver: driverName,
    passenger: "Passenger Name", // Placeholder
    vehicle: selectedVehicle,
    status: "Aceptado",
  };

  socket.emit("accept_trip", tripData);
  document.getElementById("trip-info").style.display = "none";
  document.getElementById("new-trip").style.display = "block";
  document.getElementById("trip-details").innerHTML = `
    <p>ID: ${tripData.tripId}</p>
    <p>Origen: ${tripData.origin}</p>
    <p>Destino: ${tripData.destination}</p>
    <p>Conductor: ${tripData.driver}</p>
    <p>Placa: ${tripData.vehicle}</p>
    <p>Estado: ${tripData.status}</p>
  `;
  currentTripId = tripData.tripId;
});

// Botón de desactivar vehículo
document.getElementById("deactivate-btn").addEventListener("click", () => {
  socket.emit("deactivate_driver", {
    name: driverName,
    vehicle: selectedVehicle,
  });
});

// Pantalla de viaje en progreso
socket.on("trip_started", (tripData) => {
  if (tripData.driver === driverName && tripData.tripId === currentTripId) {
    document.getElementById("new-trip").style.display = "none";
    document.getElementById("trip-in-progress").style.display = "block";
    document.getElementById("trip-in-progress-details").innerHTML = `
      <p>Origen: ${tripData.origin}</p>
      <p>Destino: ${tripData.destination}</p>
      <p>Pasajero: ${tripData.passenger}</p>
    `;
  }
});

document.getElementById("end-trip-btn").addEventListener("click", () => {
  socket.emit("end_trip", { tripId: currentTripId });
  document.getElementById("trip-in-progress").style.display = "none";
  document.getElementById("trip-info").style.display = "block";
});
