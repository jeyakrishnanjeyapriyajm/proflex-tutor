const express = require("express");

const { runCCode } = require("../controllers/compilerController");
const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/run", protect, runCCode);

module.exports = router;