const express = require("express");
const { getRandomFlag, getRandomFlags } = require("../utils/randomUtils");

const router = express.Router();

router.get("/random-flag", getRandomFlag);
router.get("/random-flags", getRandomFlags);

module.exports = router;
