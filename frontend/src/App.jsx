import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./components/Leaderboard";
//import NotFound from "./pages/NotFound"; // Optional: 404 Page

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
