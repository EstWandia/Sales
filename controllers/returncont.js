import db from '../models/index.js'
import sequelize from "sequelize";
import { Op } from 'sequelize'; // Add this line if Sequelize is imported from the package


const {Returneditems,Solditems,Allitems} = db

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
        const { id } = req.params; // Returned item ID

        // Find the returned item
        const returnedItem = await Returneditems.findByPk(id);
        if (!returnedItem) {
            return res.status(404).json({ message: "Returned item not found." });
        }               

        // Find the corresponding item in `allItems` using `item_id` (or another identifier if needed)
        const item = await Allitems.findByPk(returnedItem.sold_item_id);
       

        if (!item) {
            return res.status(404).json({ message: "Item not found in inventory." });
        }

        // Add the returned quantity back to the inventory
        item.in_stock = parseFloat(item.in_stock) + parseFloat(returnedItem.quantity);
        
        await item.save();

        // Delete the returned item record after restocking
        await returnedItem.destroy();

        res.json({ message: "Returned item restocked and removed from returned items list." });

    } catch (error) {
        console.error("Error confirming returned item:", error);
        res.status(500).json({ message: "Failed to confirm returned item." });
    }
};
