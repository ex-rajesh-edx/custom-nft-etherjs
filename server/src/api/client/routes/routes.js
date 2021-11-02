import express from "express";
import controllers from "../controller/transaction.controller";

const router = express.Router();

router.route("/send-transaction")
    .post(controllers.sendTransaction);
// router.route("/read-transaction")
//     .post();

module.exports = router;

