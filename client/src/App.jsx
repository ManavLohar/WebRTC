import { Route, Routes } from "react-router-dom";
import "./App.css";
import Lobby from "./components/screens/Lobby";
import Room from "./components/screens/Room";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
