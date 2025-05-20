var express = require("express");
var router = express.Router();

const periodsController = require("../controllers/period");

router.get("/", periodsController.getAllPeriods);

//localhost:3000/cats/5sa4d949qw86d5sa4d6sa
//req.params.id

router.get("/:id", periodsController.getPeriodById);

router.delete("/:id", periodsController.deletePeriod);

router.put("/:id", periodsController.updatePeriod);

router.post("/", periodsController.createPeriod);

module.exports = router;
