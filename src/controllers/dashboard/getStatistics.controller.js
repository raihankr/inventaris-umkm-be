import { getStatistics } from '../../services/dashboard/getStatistics.service.js';

const getStatisticsController = async (req, res, next) => {
  try {
    const statistics = await getStatistics();
    res.status(200).json({
      message: 'Success get statistics',
      data: statistics,
    });
  } catch (error) {
    next(error);
  }
};

export default getStatisticsController;
