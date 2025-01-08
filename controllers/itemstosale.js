import { Sequelize } from 'sequelize';
import db from '../models/index.js'

const { Allitems } =db

export const Getallitems = async(req,res)=>{
    try{
        const {name,in_stock,price } =req.query;
        const filters ={};


        //if (id) filters.id = { [Sequelize.Op.like]: `%${id}%` };
        if (name) filters.name = { [Sequelize.Op.like]: `%${name}%` };  // case-insensitive search
        if (in_stock && !isNaN(in_stock)) filters.in_stock = { [Sequelize.Op.eq]: parseInt(in_stock) };  // Ensure it's a number
        if (price && !isNaN(price)) filters.price = { [Sequelize.Op.eq]: parseFloat(price) };  // Ensure it's a float

        const itemsTosale=await Allitems.findAll({
            attributes:['id','name','in_stock','price'],
            where:filters
    })
    const items = itemsTosale.map(item => item.get({ plain: true }));
        res.status(200).json(items)
     }catch(error){
        console.error('Error getting items to sell:',error.message)
        res.status(500).send('server error')

    }

}
export const getItembyid = async (req, res) => {
    const { id } = req.params; 
    
    try {
      
      const item = await Allitems.findOne({
        where: { id },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      return res.json({
        id: item.id,
        name: item.name,
        in_stock: item.in_stock,
        price: item.price,
        buying_price: item.buying_price,
        created_at: item.created_at,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch item details' });
    }
  };
 
  
  export const getUpdatebyid = async (req, res) => {
    const { id } = req.params;
    const { name, in_stock,price,buying_price } = req.body;
  
    try {
      // Find the item first
      const item = await Allitems.findOne({
        where: { id },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Update the item
      const updatedItem = await item.update({
        name,
        in_stock,
        price,
        buying_price
      });
  
      return res.status(200).json({
        message: 'Update successful',
        updatedItem: updatedItem.toJSON(),
      });
    } catch (error) {
      console.error('Error updating item:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const getDeletebyid = async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Fetch all sold items from the database
      const allItems = await Allitems.findAll();
  
      // Find the index of the item to delete based on the itemId
      const itemIndex = allItems.findIndex(item => item.id === itemId);
  
      if (itemIndex === -1) {
        // If item not found, return an error
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Get the item to delete from the database
      const itemToDelete = allItems[itemIndex];
  
      // Delete the item from the database
      await itemToDelete.destroy();
  
      // Send a response confirming the deletion
      res.json({ message: 'Item successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  export const createbyid = async (req, res) => {
    const { name, in_stock,price,buying_price } = req.body;

    try {
        // Validate input
        if (!name || !price||typeof in_stock !== 'number') {
            return res.status(400).json({ error: 'Name and In Stock are required' });
        }

        // Create new category in the database
        const newitems = await Allitems.create({
            name,
            in_stock,
            price,
            buying_price
        });

        return res.status(201).json({
            message: 'Category created successfully',
            category: newitems.toJSON(),
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getinstockItems =async (req, res) => {
    try{

        //const formattedDate = getFormattedDate(); 
        const results =await Allitems.count()
        const instockItems =results || 0;
        res.json({instockItems});
    }catch(error){
        console.error('Error executing database query:',error)
        res.status(500).json({error:'you got issues in your query'})

    }
}
 
  
//export default Getallitems;