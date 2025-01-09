import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();

  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId: email, roomId });
  };

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [handleRoomJoined, socket]);

  return (
    <div className="home-container">
      <div className="input-container">
        <h3>Enter your email or room ID</h3>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email here"
        />
        <input
          type="text"
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room code"
        />
        <button onClick={() => handleJoinRoom()}>Enter Room</button>
      </div>
    </div>
  );
};

export default Home;
