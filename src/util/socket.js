import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  withCredentials: true, // withCredentials 옵션 : 쿠키를 포함하여 요청을 보냄
});
