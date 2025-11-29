import express from 'express';
import { getRecentTransaction } from '../controllers/dashboard/getRecentTransaction.controller.js';
import { getLowStockProducts } from '../controllers/dashboard/getLowStockProducts.controller.js';
import { getTransactionTrend } from '../controllers/dashboard/getTransactionTrend.controller.js';

export const dashboardRoutes = express.Router()

dashboardRoutes.get('/transaction-trend', getTransactionTrend)
// dashboardRoutes.get('/categories-distribution')
// dashboardRoutes.get('/statistics')
dashboardRoutes.get('/recent-transactions', getRecentTransaction)
dashboardRoutes.get('/low-stock-products', getLowStockProducts)