import { Server } from "socket.io";
import { allowedOrigins } from "../middleware/security.js";

let connections = {}; // roomId -> [socketId, ...]
let messages = {}; // roomId -> [{sender, data, socket-id-sender}]
let timeOnline = {};
let usernames = {}; // socketId -> username (new state)
let hosts = {}; // roomId -> hostSocketId (first join user as  Host)

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (path, username) => {
      if (connections[path] === undefined) {
        connections[path] = [];
        hosts[path] = socket.id; // room first joiner Host
      }
      connections[path].push(socket.id);
      usernames[socket.id] = (username && String(username).trim()) || "Guest";

      timeOnline[socket.id] = new Date();

      // Room all participants
      const namesInRoom = {};
      connections[path].forEach((id) => {
        namesInRoom[id] = usernames[id] || "Guest";
      });

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
          namesInRoom,
          hosts[path],
        );
      }

      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false],
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // Host  "End Call"  — all participants  disconnect
    socket.on("end-call", () => {
      for (const [roomKey, roomValue] of Object.entries(connections)) {
        if (roomValue.includes(socket.id)) {
          roomValue.forEach((id) => {
            io.to(id).emit("call-ended");
          });
          delete connections[roomKey];
          delete hosts[roomKey];
          break;
        }
      }
    });

    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections)),
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            // disconnect hone Host
            if (hosts[key] === socket.id) {
              hosts[key] = connections[key][0] || undefined;
            }

            if (connections[key].length === 0) {
              delete connections[key];
              delete hosts[key];
            }
          }
        }
      }

      delete usernames[socket.id];
    });
  });

  return io;
};