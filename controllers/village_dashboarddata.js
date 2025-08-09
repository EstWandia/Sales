import db from '../models/index.js';
import sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; // Add this line if Sequelize is imported from the package


const {VillageSolditems,VillageAllitems,VillageReturneditems} =db;

export const getALLSells=async (req, res) => {
        try {
          const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

        const results = await VillageSolditems.sum('amount',
          { 
            where: {
              created_at: {
                [Op.between]: [startOfMonth, endOfMonth]
              }
            }
          }

        );
        const totalInstock =results || 0;
        //console.log(totalInstock);
            res.json({totalInstock});
        }catch(error){
            console.error('Error executing database query:', error);
            res.status(500).json({error: 'Internal Server error'});
        }
}
export const getTodaySells=async (req, res) => {
  
  try {
  const formattedDate = getFormattedDate()
  //console.log(formattedDate);
  const results = await VillageSolditems.sum('amount',
    { 
      where: { 
        created_at: {
          [Op.gte]: formattedDate + " 00:00:00", // Start of the day
          [Op.lte]: formattedDate + " 23:59:59", 
        }
      } 
    }
  );
  const totalInstock =results || 0;
  //console.log(totalInstock);
      res.json({totalInstock});
  }catch(error){
      console.error('Error executing database query:', error);
      res.status(500).json({error: 'Internal Server error'});
  }
}
export const getItemsSoldToday =async (req, res) => {
    try{

        const formattedDate = getFormattedDate(); 
          const results = await VillageSolditems.sum("quantity", {
          where: { 
            created_at: {
              [Op.gte]: formattedDate + " 00:00:00", // Start of the day
              [Op.lte]: formattedDate + " 23:59:59", 
            }
          } 
    })
        const totalItems =results || 0;
        res.json({totalItems});
    }catch(error){
        console.error('Error executing database query:',error)
        res.status(500).json({error:'you got issues in your query'})

    }
}
export const getAllitemsSold =async (req, res) => {
  try{
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
    const results = await VillageSolditems.sum("quantity", {
      where: {
        created_at: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });
      const totalItems =results || 0;
      res.json({totalItems});
  }catch(error){
      console.error('Error executing database query:',error)
      res.status(500).json({error:'you got issues in your query'})

  }
}
export const getTodayProfit = async (req, res) => {
  try {
      const formattedDate = getFormattedDate();

      // Fetch and calculate profit for each record
      const results = await VillageSolditems.findAll({
          attributes: [
              [
                  sequelize.literal("(price * quantity) - (buying_price*quantity)"),
                  "profit", // Alias for the calculated field
              ],
          ],
          where: {
              created_at: {
                  [Op.gte]: `${formattedDate} 00:00:00`, // Start of the day
                  [Op.lte]: `${formattedDate} 23:59:59`, // End of the day
              },
          },
          raw: true, // Ensures raw data is returned
      });

      // Aggregate the profits
      const beforeProfit = results.reduce(
          (sum, record) => sum + parseFloat(record.profit || 0),
          0
      );

      const totalProfit = Math.max(beforeProfit-800, 0);

      // Send response
     res.json({ totalProfit });
  } catch (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server error" });
  }
};
export const getCashInStock = async (req, res) => {
  try {
      const formattedDate = getFormattedDate();

      // Fetch and calculate profit for each record
      const results = await VillageAllitems.findAll({
          attributes: [
              [
                  sequelize.literal("(buying_price*in_stock)"),
                  "instock", // Alias for the calculated field
               ],
          ],
          raw: true, // Ensures raw data is returned
      });

      // Aggregate the profits
      const totalStock = results.reduce(
          (sum, record) => sum + parseFloat(record.instock || 0),
          0
      );

      // Send response
      res.json({ totalStock });
  } catch (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMapItems = async (req,res)=>{
try{
    const Solditem = await VillageSolditems.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
    });

    const items =Solditem.map(item => item.get({ plain: true }));
    
    //console.log(items)
    res.status(200).json(items)
}catch(error){
    console.error('Error getting items to sell:',error.message)
    res.status(500).send('server error')
}
}

 export const  mapSoldItems = async (req, res) => {
    try {
      const formattedDate = getFormattedDate();
      const salesData = await db.VillageSolditems.findAll({
        order: [['created_at', 'DESC']],
        where:  {
          created_at: {
            [Op.gte]: `${formattedDate} 00:00:00`, // Start of the day
            [Op.lte]: `${formattedDate} 23:59:59`, // End of the day
        },
        },
      });
      const formattedSalesData = salesData.map(item => ({
        id:item.id,
        name: item.name,
        quantity: item.quantity,
        amount: item.amount,
        state: item.state === 1 ? 'cash' : 'mpesa',
        created_at: new Date(item.created_at).toLocaleString()
      }));
  
      res.json(formattedSalesData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching sales data' });
    }
  }
  export const confirmSale = async (req, res) => {
    try {
      console.log('kasongo')
      const { itemsSold } = req.body;
      //console.log('Received itemsSold:', itemsSold);
      const transactionId = uuidv4();
      
      for (const item of itemsSold) {
        const itemId = uuidv4();
        console.log("Generated UUID:", itemId);

        const {  id,name, quantity, price, amount, state,buying_price, category_id } = item;

        await VillageSolditems.create({ 
          id:itemId,
          item_id:item.id,
          transaction_id: transactionId, // Assign same transaction ID
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          buying_price: item.buying_price,
          amount:item.amount,
          state:state,
          category_id:item.category_id
        });

        console.log("Item id:", item.id);
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
      
  
      res.json({ success: true, message: 'Sale confirmed successfully!' });
  
    } catch (error) {
      console.error('Error during sale confirmation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const Reportitem = async (req, res) => {
    try {
      const allReportItems = await VillageAllitems.findAll();
      const formattedItems = allReportItems.map(item => ({
        ...item.toJSON(),
        created_at: item.createdAt
          ? item.createdAt.toISOString().split('T')[0] 
          : 'N/A', // Example: YYYY-MM-DD
      }));
      res.json(formattedItems); // Send the formatted items to the frontend
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  export const getTotalCashAmount = async (req, res) => {
    try {
      const formattedDate = getFormattedDate(); // Get the formatted date string
      //console.log(formattedDate);
  
      // Query for today's total cash amount based on the formatted date
      const cash = await VillageSolditems.sum('quantity', { 
        where: { 
          state: 0, 
          created_at: {
            [Op.gte]: formattedDate + " 00:00:00", // Start of the day
            [Op.lte]: formattedDate + " 23:59:59", 
          }
        } 
      });
      console.log(cash);

  
      const mpesa = await VillageSolditems.sum('quantity', {
         where: {
           state: 1,
           created_at: {
            [Op.gte]: formattedDate + " 00:00:00", // Start of the day
            [Op.lte]: formattedDate + " 23:59:59", 
          }
       } });
  
      res.json({ cash, mpesa }); // Send JSON response
    } catch (error) {
      console.error('Error calculating total cash amount:', error);
      res.status(500).json({ error: 'Failed to calculate totals' });
    }
  };
  
  // Function to format today's date as a string (yyyy-mm-dd)
  function getFormattedDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = now.getFullYear();
    
    const formattedDate = `${year}-${month}-${day}`; // e.g., "2025-01-02"
    return formattedDate;
  }
  export const Perm = (req, res) => {
    try {
        // Ensure the user is authenticated and has the perm field
        if (!req.session || !req.session.user || typeof req.session.user.perm === 'undefined') {
            return res.status(401).json({ error: 'Unauthorized access or missing permission' });
        }

        // Send the permission value to the client
        res.json({ perm: req.session.user.perm });
    } catch (error) {
        console.error('Error fetching permission:', error.message);
        res.status(500).json({ error: 'Failed to fetch user permission' });
    }
};

export const getsoldItemss = async (req, res) => {
  try {
      const { id } = req.params;
      console.log("Fetching sold item details for ID:", id);  // Debugging log

      const item = await VillageSolditems.findOne({ where: { id } });

      if (!item) {
          console.error("Error: No item found for ID:", id);
          return res.status(404).json({ error: 'Item not found' });
      }

      console.log("Found item details:", item.toJSON());  // Log the actual item

      res.json({
          id: item.id,
          name: item.name,
          quantity: item.quantity
      });
  } catch (error) {
      console.error("Error fetching sold item details:", error);
      res.status(500).json({ error: 'Server error' });
  }
};

export const getReturnbyid = async (req, res) => {
  try {
      const { id } = req.params; // This is sold_item_id
      const { quantity } = req.body;

      console.log("Processing return for Sold Item ID:", id, "Quantity:", quantity);

      const returnQuantity = parseInt(quantity, 10);

      // Step 1: Fetch the sold item (guarantee it exists)
      const soldItem = await VillageSolditems.findByPk(id);

      if (!soldItem) {
          console.log('Sold item not found for ID:', id);
          return res.status(404).json({ error: 'Sold item not found' });
      }

      console.log('Found sold item:', soldItem.toJSON());

      // Step 2: Validate return quantity
      if (returnQuantity <= 0 || returnQuantity > soldItem.quantity) {
          return res.status(400).json({ error: 'Invalid return quantity' });
      }

      // Step 3: Calculate new stock and returned amount
      const newQuantity = soldItem.quantity - returnQuantity;
      const returnedAmount = returnQuantity * soldItem.price;

      const returnId = uuidv4();
      // Step 4: Create returned item record
      const returnedItem = await VillageReturneditems.create({
          id:   returnId,
          sold_item_id: soldItem.item_id,  // Guaranteed correct because we fetched it above
          name: soldItem.name,
          quantity: returnQuantity,
          amount: returnedAmount,      // Using selling price * returned quantity
          price: soldItem.price,
          buying_price: soldItem.buying_price,
          state: soldItem.state,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null
      });

      console.log("Inserted into returned_items:", returnedItem.toJSON());

      // Step 5: Update or delete the sold item record
      if (newQuantity <= 0) {
          // Remove item if no more stock left
          await VillageSolditems.destroy({ where: { id } });
          console.log(`Sold item with ID ${id} deleted (no stock left)`);
      } else {
          // Update item quantity and amount
          const newAmount = newQuantity * soldItem.price;

          await VillageSolditems.update({
              quantity: newQuantity,
              amount: newAmount
          }, {
              where: { id }
          });

          console.log(`Sold item with ID ${id} updated (new quantity: ${newQuantity}, new amount: ${newAmount})`);
      }

      // Step 6: Final response
      res.json({ success: true, message: 'Return processed successfully', returnedItem });

  } catch (error) {
      console.error('Error processing return:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const printReceipt = async (req, res) => {
  try {
    const { id } = req.query; // transactionId

    if (!id) {
      return res.status(400).json({ error: 'Missing transaction ID' });
    }

    const items = await Solditems.findAll({
      where: { transaction_id: id },
      raw: true
    });

    if (!items.length) {
      return res.status(404).json({ error: 'No items found for receipt' });
    }

    const receipt = [];

    // Title
    receipt.push({
      type: 0,
      content: 'SALES RECEIPT',
      bold: 1,
      align: 1,
      format: 2
    });

    receipt.push({
      type: 0,
      content: `Transaction ID: ${id}`,
      bold: 0,
      align: 0,
      format: 0
    });

    receipt.push({
      type: 0,
      content: '-----------------------------',
      bold: 0,
      align: 0,
      format: 0
    });

    // Each item
    for (const item of items) {
      receipt.push({
        type: 0,
        content: `${item.name} x${item.quantity} - Ksh ${item.amount}`,
        bold: 0,
        align: 0,
        format: 0
      });
    }

    // Total
    const total = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    receipt.push({
      type: 0,
      content: `Total: Ksh ${total.toFixed(2)}`,
      bold: 1,
      align: 2,
      format: 1
    });

    // Thank you message
    receipt.push({
      type: 0,
      content: 'Thank you for shopping!',
      bold: 0,
      align: 1,
      format: 0
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(receipt);

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Server error' });
  }
};