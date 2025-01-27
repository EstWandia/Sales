import db from '../models/index.js';
import sequelize from "sequelize";
import { v4 as uuidv4 } from 'uuid';
const { Op } = db.Sequelize; // Add this line if Sequelize is imported from the package


const {Solditems,Allitems} =db;

export const getALLSells=async (req, res) => {
        try {
        const results = await Solditems.sum('amount');
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
  const results = await Solditems.sum('amount',
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
        const results =await Solditems.count({
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
      const results =await Solditems.count()
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
      const results = await Solditems.findAll({
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
      console.log("Fetched results:", results);

      // Aggregate the profits
      const totalProfit = results.reduce(
          (sum, record) => sum + parseFloat(record.profit || 0),
          0
      );

      // Send response
      res.json({ totalProfit });
  } catch (error) {
      console.error("Error executing database query:", error);
      res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMapItems = async (req,res)=>{
try{
    const Solditem = await Solditems.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
    });

    const items =Solditem.map(item => item.get({ plain: true }));
    
    console.log(items)
    res.status(200).json(items)
}catch(error){
    console.error('Error getting items to sell:',error.message)
    res.status(500).send('server error')
}
}

//  export const  mapSoldItems = async (req, res) => {
//     try {
//       const salesData = await db.Solditems.findAll({
//         limit: 5,
//         order: [['created_at', 'DESC']],
//         include: {
//           model: db.Itemscategory,
//           attributes: ['name'], // Select the category name
//           required: true // This ensures that sold_items will only be fetched if there's a matching category
//         }
//       });
  
//       const formattedSalesData = salesData.map(item => ({
//         category_name: item.Itemscategory.name,
//         name: item.name,
//         quantity: item.quantity,
//         amount: item.amount,
//         status: item.status === 1 ? 'cash' : 'mpesa', // Adjust status as needed
//       created_at: item.created_at.toISOString().split('T')[0] 
//       }));
  
//       res.json(formattedSalesData);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Error fetching sales data' });
//     }
//   }
  export const confirmSale = async (req, res) => {
    try {
      console.log('kasongo')
      const { itemsSold } = req.body;
      console.log('Received itemsSold:', itemsSold);
      
      for (const item of itemsSold) {
        const itemId = uuidv4();
        console.log("Generated UUID:", itemId);

        const { name, quantity, price, amount, state,buying_price, category_id } = item;

        await Solditems.create({ 
          id:itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          buying_price: item.buying_price,
          amount:item.amount,
          state:state,
          category_id:item.category_id
        });
        
        const existingItem = await Allitems.findOne({ where: { id: item.id } });
        
            if (existingItem) {
                const newQuantity = existingItem.in_stock - item.quantity;
                console.log(newQuantity);

                if (newQuantity < 0) {
                    return res.status(400).json({ error: `Insufficient stock for item: ${item.name}` });
                }

                await Allitems.update(
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
      const allReportItems = await Allitems.findAll();
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
      const cash = await Solditems.sum('amount', { 
        where: { 
          state: 0, 
          created_at: {
            [Op.gte]: formattedDate + " 00:00:00", // Start of the day
            [Op.lte]: formattedDate + " 23:59:59", 
          }
        } 
      });
      console.log(cash);

  
      const mpesa = await Solditems.sum('amount', {
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

  