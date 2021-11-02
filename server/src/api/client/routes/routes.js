import express from "express";
import { controllers } from "../controller/transaction.controller";

const clientRoutes = express.Router();

clientRoutes.route("/send-transaction")
    .post(controllers.sendTransaction);
// router.route("/read-transaction")
//     .post();

export default clientRoutes;

