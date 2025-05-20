var express = require("express");
var router = express.Router();

const LiteraryGroupController = require("../controllers/LiteraryGroup");

router.get("/", LiteraryGroupController.getAllLiteraryGroups);

//localhost:3000/cats/5sa4d949qw86d5sa4d6sa
//req.params.id

router.get("/:id", LiteraryGroupController.getLiteraryGroupById);

router.delete("/:id", LiteraryGroupController.deleteLiteraryGroup);

router.put("/:id", LiteraryGroupController.updateLiteraryGroup);

router.post("/", LiteraryGroupController.createLiteraryGroup);

module.exports = router;
