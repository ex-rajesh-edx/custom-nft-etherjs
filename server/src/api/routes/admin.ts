import express from "express";
import { controllers } from "../interfaces/IAdmin";

const router = express.Router();

router.route("/send-transaction")
    .post(controllers.sendTransaction);

export default router;