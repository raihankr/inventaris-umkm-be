import express from 'express';
import { getRecentTransaction } from '../controllers/dashboard/getRecentTransaction.controller.js';
import { getLowStockProducts } from '../controllers/dashboard/getLowStockProducts.controller.js';
import { getTransactionTrend } from '../controllers/dashboard/getTransactionTrend.controller.js';
import getStatisticsController from '../controllers/dashboard/getStatistics.controller.js';

export const dashboardRoutes = express.Router()

dashboardRoutes.get('/transaction-trend', getTransactionTrend)
dashboardRoutes.get('/statistics', getStatisticsController)
dashboardRoutes.get('/recent-transactions', getRecentTransaction)
dashboardRoutes.get('/low-stock-products', getLowStockProducts)