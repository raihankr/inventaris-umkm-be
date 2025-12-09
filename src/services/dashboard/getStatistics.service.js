import prisma from '../../utils/client.js';

export const getStatistics = async () => {
  const year = new Date().getFullYear();
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const totalProducts = prisma.products.count({
    where: {
      isActive: true,
    },
  });

  const totalAssetValue = prisma.$queryRaw`
    SELECT SUM(CAST(stocks.amount AS BIGINT) * CAST(stocks.price AS BIGINT)) as "totalAssetValue"
    FROM stocks
    WHERE stocks."isActive" = true
  `;

  const transactions =await prisma.transactions.groupBy({
    by: ['type'],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      total_price: true,
    },
  });

  const [productsCount, assetValueResult, transactionsResult] = await Promise.all([
    totalProducts,
    totalAssetValue,
    transactions,
  ]);

  const totalAsset = assetValueResult[0]?.totalAssetValue || 0;

  const transactionSummary = transactionsResult.reduce((acc, curr) => {
    acc[curr.type] = curr._sum.total_price || 0;
    return acc;
  }, {});

  return {
    totalProducts: productsCount,
    totalAssetValue: Number(totalAsset),
    transactions: {
      buy: transactionSummary.buy || 0,
      sell: transactionSummary.sell || 0,
    },
  };
};
