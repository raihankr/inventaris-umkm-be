import express from "express";
import { createTransaction } from "../controllers/transactions/createTransaction.controller.js";
import { getTransaction } from "../controllers/transactions/getTransaction.controller.js";
import {listTransactions} from "../controllers/transactions/listTransactions.controller.js";

export const transactionRoutes = express.Router();

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/:id", getTransaction);
transactionRoutes.get("/", listTransactions);
