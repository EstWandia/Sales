import db from '../models/index.js'
import { Op } from 'sequelize'; // Add this line if Sequelize is imported from the package


const {Returneditems,Solditems} = db

export const getReturnedItems = async (req, res) => {
    try {
        console.log("Fetching returned items...");
        
        const items = await Returneditems.findAll(); 

        return res.json(items);
    } catch (error) {
        console.error("Error fetching returned items:", error);
        return res.status(500).json({ error: "Failed to fetch returned items" });
    }
};

export const confirmReturnedItem = async (req, res) => {
    try {
        const { id } = req.params; // `id` is the returned item's ID (the primary key in returned_items table)

        // Find the returned item by its own primary key
        const returnedItem = await Returneditems.findByPk(id);
        if (!returnedItem) {
            return res.status(404).json({ message: "Returned item not found." });
        }

        // Find the original sold item using the correct `sold_item_id`
        const soldItem = await Solditems.findByPk(returnedItem.sold_item_id);
        if (!soldItem) {
            return res.status(404).json({ message: "Original sold item not found." });
        }

        // Add back the returned quantity to the sold item
        soldItem.quantity += returnedItem.quantity;
        await soldItem.save();

        // Delete the returned item record after processing
        await returnedItem.destroy();

        res.json({ message: "Item restored to stock and removed from returned items." });

    } catch (error) {
        console.error("Error confirming returned item:", error);
        res.status(500).json({ message: "Failed to confirm returned item." });
    }
};

