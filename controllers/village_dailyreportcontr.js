import db from '../models/index.js';
import { Op, Sequelize } from 'sequelize'; // Ensure Sequelize is imported directly

const { VillageDailyreport, VillageSolditems } = db;

export const getDailyReports = async (req, res) => {
    try {
        console.log("Fetching daily reports...");

        const reports = await VillageSolditems.findAll({
            attributes: [
                [Sequelize.fn("DATE", Sequelize.col("created_at")), "sale_date"],
                [Sequelize.fn("SUM", Sequelize.col("amount")), "total_sale"],
                [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_quantity"],
                [Sequelize.literal("SUM((price - buying_price) * quantity)"), "total_profit"],
                [Sequelize.fn("MAX", Sequelize.col("created_at")), "created_at"],
            ],
            where: { deleted_at: { [Op.is]: null } },
            group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
            order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "DESC"]],
        });

        if (!reports.length) {
            console.warn("No reports found.");
            return res.json([]);
        }

        const reportsWithAdjustedProfit = reports.map(report => {
            const totalProfit = report.get('total_profit');

            if (totalProfit === null || totalProfit === undefined) {
                console.error("Warning: total_profit is undefined for a record.");
                return { ...report.get(), total_profit: 0 };
            }

            const adjustedProfit = parseFloat(totalProfit) - 800;
            return { ...report.get(), total_profit: adjustedProfit };
        });

        console.log("Daily reports fetched successfully.");
        res.json(reportsWithAdjustedProfit);
    } catch (error) {
        console.error("Error fetching daily reports:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
