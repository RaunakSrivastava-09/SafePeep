// "use client";

// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// let socket;

// export default function useAlertSocket(userId, onNewAlert) {
//   const joinedRef = useRef(false);

//   useEffect(() => {
//     if (!userId) return;

//     // Prevent multiple socket instances
//     if (!socket) {
//       socket = io({
//         path: "/api/socket_io",
//       });
//     }

//     const handleConnect = () => {
//       if (!joinedRef.current) {
//         socket.emit("join", userId);
//         joinedRef.current = true;
//       }
//     };

//     socket.on("connect", handleConnect);

//     socket.on("new-alert", (alert) => {
//       onNewAlert(alert);
//     });

//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("new-alert");
//     };
//   }, [userId, onNewAlert]);

//   return socket;
// }