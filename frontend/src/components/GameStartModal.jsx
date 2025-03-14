import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../index.css";

const GameStartModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [gameMode, setGameMode] = useState("classic");
  const [flagCount, setFlagCount] = useState(10); // Default for Classic Mode
  const navigate = useNavigate(); // Initialize navigate function

  const handleStart = () => {
    if (!username.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Navigate to game page with selected options
    navigate("/Game", { state: { username, gameMode, flagCount } });

    // Close the modal after navigation
    onClose();
  };

  const modeDescriptions = {
    classic: "🏆 Classic Mode: Choose the number of flags (10, 20, 50, 100) and guess them at your own pace.",
    "time-attack": "⏳ Time Attack: You have 60 seconds to guess as many flags as possible. Fast and challenging!",
    elimination: "❌ Elimination: One wrong guess, and it's game over! Test your perfect accuracy.",
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>🎮 Start Your Game</h2>

        {/* Player Name Input */}
        <label>Enter Your Name:</label>
        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Game Mode Selection */}
        <label>Select Game Mode:</label>
        <div className="game-modes">
          {["classic", "time-attack", "elimination"].map((mode) => (
            <button
              key={mode}
              className={gameMode === mode ? "selected" : ""}
              onClick={() => setGameMode(mode)}
            >
              {mode === "classic" && "🏆 Classic"}
              {mode === "time-attack" && "⏳ Time Attack"}
              {mode === "elimination" && "❌ Elimination"}
            </button>
          ))}
        </div>

        {/* Mode Description */}
        <p className="mode-description">{modeDescriptions[gameMode]}</p>

        {/* Flag Count Selector (Only for Classic Mode) */}
        {gameMode === "classic" && (
          <div className="flag-count">
            <label>Number of Flags:</label>
            <select value={flagCount} onChange={(e) => setFlagCount(Number(e.target.value))}>
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>{num} Flags</option>
              ))}
            </select>
          </div>
        )}

        {/* Start Game Button (Disabled until name is entered) */}
        <button className="start-btn" onClick={handleStart} disabled={!username.trim()}>
          Start Game 🚀
        </button>
      </div>
    </div>
  );
};

export default GameStartModal;
