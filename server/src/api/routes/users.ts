import express from "express";
import { controllers } from "../interfaces/IUsers";

const clientRoutes = express.Router();

// create a nft with metadata
clientRoutes.route("/send-transaction")
    .post(controllers.sendTransaction);

// get a nft details by its token number
clientRoutes.route("/get-nft")
    .post(controllers.getNFTByTokenNo);

export default clientRoutes;

