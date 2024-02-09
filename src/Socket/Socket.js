import { io } from "socket.io-client";

export const socket_io = io(process.env.REACT_APP_BASE_URL);

