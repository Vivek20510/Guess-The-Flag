import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());

//Enable CORS for frontend communication
// app.use(cors({
//     origin: "https://flag-game-iecx.onrender.com",  // ✅ Replace with frontend URL
//     methods: ["GET", "POST"],
//     credentials: true
// }));
app.use(cors({
    origin: "http://localhost:5173",  // ✅ Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true
}));


let allFlags = []; // Stores all country flag data

// 🌍 **Fetch country flags on server startup with retry mechanism**
async function fetchFlags(retryCount = 3) {
    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        allFlags = response.data.map((country) => ({
            name: country.name.common,
            flag: country.flags.svg,
        }));
        console.log(`✅ Loaded ${allFlags.length} flags into memory.`);
    } catch (error) {
        console.error("❌ Error fetching flags:", error);
        if (retryCount > 0) {
            console.log(`🔄 Retrying... Attempts left: ${retryCount}`);
            setTimeout(() => fetchFlags(retryCount - 1), 3000);
        }
    }
}
fetchFlags(); // Load flags when server starts

// 🎯 **Categorized flags into difficulty levels**
const easyFlags = ["United States", "India", "Canada", "Germany", "France", "Japan", "Brazil", "Australia", "Italy", "United Kingdom"];
const mediumFlags = ["Norway", "Denmark", "Greece", "Portugal", "South Africa", "Colombia", "Thailand", "Malaysia", "Philippines", "Vietnam"];
const hardFlags = ["Bhutan", "Burundi", "Eswatini", "Nauru", "Lesotho", "Comoros", "Tuvalu", "Djibouti", "Seychelles", "Micronesia"];

// 📌 **Helper function to get random flags**
const getRandomFlags = (list, count) => list.sort(() => Math.random() - 0.5).slice(0, count);

// 🏁 **API: Fetch flags dynamically based on player performance**
app.get("/api/random-flags", async (req, res) => {
    try {
        if (!allFlags.length) return res.status(500).json({ error: "Flags not loaded yet. Please retry later." });

        const { numFlags, difficulty } = req.query;
        const flagCount = Math.min(Math.max(parseInt(numFlags) || 20, 5), 100); // ✅ Validating input (Min: 5, Max: 100)

        let easyCount, mediumCount, hardCount;
        if (difficulty === "easy") {
            easyCount = flagCount;
            mediumCount = hardCount = 0;
        } else if (difficulty === "medium") {
            easyCount = Math.floor(flagCount * 0.5);
            mediumCount = Math.floor(flagCount * 0.5);
            hardCount = 0;
        } else {
            easyCount = Math.floor(flagCount * 0.3);
            mediumCount = Math.floor(flagCount * 0.4);
            hardCount = Math.floor(flagCount * 0.3);
        }

        const selectedFlags = [
            ...getRandomFlags(allFlags.filter(f => easyFlags.includes(f.name)), easyCount),
            ...getRandomFlags(allFlags.filter(f => mediumFlags.includes(f.name)), mediumCount),
            ...getRandomFlags(allFlags.filter(f => hardFlags.includes(f.name)), hardCount)
        ].sort(() => Math.random() - 0.5); // Shuffle

        res.json(selectedFlags);
    } catch (error) {
        console.error("❌ Error in /api/random-flags:", error);
        res.status(500).json({ error: "Failed to fetch flags." });
    }
});

// 🏁 **API: Fetch a single flag with multiple-choice options**
app.get("/api/random-flag", async (req, res) => {
    try {
        if (!allFlags.length) return res.status(500).json({ error: "Flags not loaded yet. Please retry later." });

        const selectedCountry = allFlags[Math.floor(Math.random() * allFlags.length)];
        const correctAnswer = selectedCountry.name;

        // Generate 3 incorrect options
        const options = new Set([correctAnswer]);
        while (options.size < 4) {
            const randomCountry = allFlags[Math.floor(Math.random() * allFlags.length)].name;
            options.add(randomCountry);
        }

        res.json({
            flag: selectedCountry.flag,
            options: Array.from(options).sort(() => Math.random() - 0.5), // Shuffle options
            correctAnswer,
        });
    } catch (error) {
        console.error("❌ Error in /api/random-flag:", error);
        res.status(500).json({ error: "Failed to fetch flag." });
    }
});

// 🚀 **Leaderboard System**
let leaderboard = [];  

// 📌 **GET Leaderboard (Top 5 scores)**
app.get("/api/leaderboard", (req, res) => {
    res.json(leaderboard.sort((a, b) => b.score - a.score).slice(0, 5)); 
});

// 📌 **POST New Score**
app.post("/api/leaderboard", (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
        return res.status(400).json({ error: "Invalid data format" });
    }

    leaderboard.push({ name, score });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 5); // Keep only top 5 scores

    res.json({ message: "Score added!", leaderboard });
});

// 🚀 **Start the server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
