const axios = require("axios");

let allFlags = [];

// 🌍 Fetch country flags once on server start
async function fetchFlags() {
    try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        allFlags = response.data.map((country) => ({
            name: country.name.common,
            flag: country.flags.svg,
        }));
        console.log(`✅ Loaded ${allFlags.length} flags into memory.`);
    } catch (error) {
        console.error("❌ Error fetching flags:", error);
    }
}
fetchFlags();

exports.getRandomFlag = (req, res) => {
    const selectedCountry = allFlags[Math.floor(Math.random() * allFlags.length)];
    res.json({ flag: selectedCountry.flag, name: selectedCountry.name });
};
