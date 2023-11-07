import { io } from "socket.io-client";

const socket = io("ws://localhost:8800");

export default socket;
