const socket = io();
let driverName = "";
let selectedVehicle = "";

document.getElementById("login-btn").addEventListener("click", () => {
  driverName = document.getElementById("driver-name").value;
  if (driverName) {
    document.getElementById("login").style.display = "none";
    document.getElementById("vehicle-selection").style.display = "block";
  }
});

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
});

document.getElementById("deactivate-btn").addEventListener("click", () => {
  socket.emit("deactivate_driver", {
    name: driverName,
    vehicle: selectedVehicle,
  });
});
