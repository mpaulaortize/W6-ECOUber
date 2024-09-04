const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let availableDrivers = [];
let trips = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Manejo de la activación del conductor
  socket.on("activate_driver", (driverData) => {
    availableDrivers.push(driverData);
    io.emit("update_available_drivers", availableDrivers);
  });

  // Manejo de la desactivación del conductor
  socket.on("deactivate_driver", (driverData) => {
    availableDrivers = availableDrivers.filter(
      (driver) => driver.name !== driverData.name
    );
    io.emit("update_available_drivers", availableDrivers);
  });

  // Manejo de la solicitud de viaje
  socket.on("request_ride", (rideRequest) => {
    io.emit("update_available_drivers_searching", availableDrivers);
  });

  // Manejo de la aceptación del viaje por parte del conductor
  socket.on("accept_trip", (tripData) => {
    tripData.status = "Aceptado";
    trips.push(tripData);
    io.emit("trip_accepted", tripData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
