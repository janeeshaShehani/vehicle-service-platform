const express = require("express");

const router = express.Router();

const {
  createGarage,
  getGarages,
} = require("../controllers/garageController");

router.post("/register", createGarage);

router.get("/", getGarages);

module.exports = router;