import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, roomId });
    },
    [email, roomId, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, roomId } = data;
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="lobby">
      <div className="form-box">
        <h1>Lobby</h1>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
          </div>
          <div className="inputBox">
            <label htmlFor="room">Room</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              id="room"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
