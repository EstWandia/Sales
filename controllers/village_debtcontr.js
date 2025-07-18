import db from '../models/index.js'
import sequelize from "sequelize";
import {v4 as uuidv4} from 'uuid';
//import { Op } from 'sequelize'; // Add this line if Sequelize is imported from the package

const {VillageDebtItems} =db

export const Debt = async (req, res) => {
    try {
      console.log('debt')
      const { itemsDebt} = req.body;
      console.log('Received debtitems:', itemsDebt);
      
      for (const item of itemsDebt) {
        const itemId = uuidv4();
        console.log("Generated UUID:", itemId);

        const { name,client_name, quantity, price, amount,amount_paid,amount_remaining, state,buying_price, category_id } = item;

        await VillageDebtItems.create({ 
          id:itemId,
          name: item.name,
          client_namename: item.client_name,
          quantity: item.quantity,
          amount_paid: item.amount_paid,
          amount_remaining: item.amount_remaining,
          price: item.price,
          buying_price: item.buying_price,
          amount:item.amount,
          state:state,
          category_id:item.category_id
        });
        
        const existingItem = await VillageAllitems.findOne({ where: { id: item.id } });
        
            if (existingItem) {
                const newQuantity = existingItem.in_stock - item.quantity;
                console.log(newQuantity);

                if (newQuantity < 0) {
                    return res.status(400).json({ error: `Insufficient stock for item: ${item.name}` });
                }

                await VillageAllitems.update(
                    { in_stock: newQuantity },
                    { where: { id: item.id } }
                );
            } else {
                return res.status(404).json({ error: `Item not found: ${item.name}` });
            }
        
      }
      
  
      res.json({ success: true, message: 'deni confirmed successfully!' });
  
    } catch (error) {
      console.error('Error during deni confirmation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };