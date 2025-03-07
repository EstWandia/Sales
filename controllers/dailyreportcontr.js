import db from '../models/index.js'
import { Op } from 'sequelize'; // Add this line if Sequelize is imported from the package


const {Dailyreport,Solditems} = db

    export const getDailyReports = async (req, res) => {
        try {
            console.log("Fetching daily reports...");
            
            // Fetch aggregated report data from sold_items
            const reports = await Solditems.findAll({
                attributes: [
                    [db.Sequelize.fn("DATE", db.Sequelize.col("created_at")), "sale_date"],
                    [db.Sequelize.fn("SUM", db.Sequelize.col("amount")), "total_sale"],
                    [db.Sequelize.fn("SUM", db.Sequelize.col("quantity")), "total_quantity"],
                    [db.Sequelize.fn("SUM", db.Sequelize.literal("amount - buying_price * quantity")), "total_profit"],
                    [db.Sequelize.fn("MAX", db.Sequelize.col("created_at")), "created_at"],
                    [db.Sequelize.fn("MAX", db.Sequelize.col("updated_at")), "updated_at"],
                ],
                where: {
                    state: 1, // Only include completed sales (adjust if needed)
                    deleted_at: { [Op.is]: null }, // Ignore soft-deleted records
                },
                group: [db.Sequelize.fn("DATE", db.Sequelize.col("created_at"))], // Group by sale date
                order: [[db.Sequelize.fn("DATE", db.Sequelize.col("created_at")), "DESC"]]
            });
            const reportsWithAdjustedProfit = reports.map(report => {
                const adjustedProfit = parseFloat(report.get('total_profit')) - 800;
                return {
                    ...report.get(),
                    total_profit: adjustedProfit
                };
            });
            
    
            console.log("Daily reports fetched successfully.");
            res.json(reportsWithAdjustedProfit);
        } catch (error) {
            console.error("Error fetching daily reports:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };