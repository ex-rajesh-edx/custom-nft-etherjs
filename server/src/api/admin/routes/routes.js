import express from "express";
import { controllers } from "../controller/transaction.controller";

const router = express.Router();

router.route("/send-transaction")
    .post(controllers.sendTransaction);

export default router;