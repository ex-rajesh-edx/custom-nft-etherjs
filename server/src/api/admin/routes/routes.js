const express = require("express");
const controllers = require("../controller/transaction.controller");

const router = express.Router();

router.route("/send-transaction")
    .post(controllers.sendTransaction);

module.exports = router;