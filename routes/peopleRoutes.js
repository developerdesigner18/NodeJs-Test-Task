const express = require("express");
const {
  getPeople,
  addPerson,
  filterPeople,
  addMultiplePeople,
} = require("../controllers/peopleController");
const checkToken = require("../middleware/middleware");

const router = express.Router();

router.get("/",checkToken, getPeople);
router.post("/filter", checkToken,filterPeople);
router.post("/bulk-add", checkToken,addMultiplePeople);
module.exports = router;
