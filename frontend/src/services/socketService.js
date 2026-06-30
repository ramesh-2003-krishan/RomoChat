import { socket } from "../config/socket";

export const connectSocket = (token) => {
  if (!token) return;
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connection request dispatched.");
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket connection disconnected.");
  }
};

export const joinRoom = (conversationId) => {
  if (!conversationId) return;
  
  if (socket.connected) {
    socket.emit("join_room", { conversationId }, (res) => {
      if (res?.success) {
        console.log(`Successfully joined room lobby: ${conversationId}`);
      } else {
        console.warn(`Failed joining room lobby: ${res?.message}`);
      }
    });
  } else {
    console.warn("Cannot join room: Socket is not connected.");
  }
};
