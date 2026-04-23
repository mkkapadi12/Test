const { Server } = require("socket.io");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Student joins their personal room (for enrollment updates)
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined personal room`);
    });

    // Student joins shared student room (for new course notifications)
    socket.on("joinStudent", () => {
      socket.join("studentRoom");
      console.log("Student joined studentRoom");
    });

    // Instructor joins instructor room (for course notifications)
    socket.on("joinInstructor", () => {
      socket.join("instructorRoom");
      console.log("Instructor joined instructorRoom");
    });

    // Admin joins admin room (for enrollment requests)
    socket.on("joinAdmin", () => {
      socket.join("adminRoom");
      console.log("Admin joined adminRoom");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
