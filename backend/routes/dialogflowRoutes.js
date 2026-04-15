const express = require("express");
const router = express.Router();
const { handleDialogflowRequest } = require("../controllers/dialogflowController");

router.post("/webhook", handleDialogflowRequest);

module.exports = router;
