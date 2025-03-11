import db from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

const { Solditems } = db;

export const getFastMoving = async (req, res) => { 
    try {
        console.log("Fetching fast-moving items...");

        const reports = await Solditems.findAll({
            attributes: [
                'item_id',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold'],
                [Sequelize.fn('GROUP_CONCAT', Sequelize.col('name')), 'names'] // Concatenates multiple names
            ],
            where: {
                item_id: {
                    [Op.not]: null,      // Exclude NULL values
                    [Op.ne]: ''          // Exclude empty strings
                }
            },
            group: ['item_id'],
            order: [[Sequelize.literal('total_sold'), 'DESC']]
        });

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching fast-moving items:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
