import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { createTransaction } from "../controllers/transactions/createTransaction.controller.js";

export const transactionRoutes = express.Router();

transactionRoutes.post('/', createTransaction);
