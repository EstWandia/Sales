import db from '../models/index.js'

const {VillageSolditems} = db

export const getAllSoldItems = async(req,res)=>{
    console.log('this')
    try{
    const all_sold = await VillageSolditems.findAll(
      {
        order:[['created_at','DESC']]
      }
    )
    const formattedData =all_sold.map(item=>({
        ...item.toJSON(),
        name:item.name,
        quantity:item.quantity,
        amount:item.amount,
        buying_price:item.buying_price,
        state:item.state,
        created_at: item.createdAt
          ? item.createdAt.toISOString().split('T')[0] 
          : 'N/A',

    }));
    res.json(formattedData)
}catch(error){
    console.error(error)
    res.status(500).send('Internal Error Server')
}
}
export const getItem = async (req, res) => {
    const { id } = req.params; 
    
    try {
      
      const item = await VillageSolditems.findOne({
        where: { id },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      return res.json({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        amount: item.amount,
        buying_price:item.buying_price,
        state: item.state,
        created_at: item.created_at,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch item details' });
    }
  };
 
  
  export const getUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, amount,buying_price, state } = req.body;
  
    try {
      // Find the item first
      const item = await VillageSolditems.findOne({
        where: { id },
      });
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Update the item
      const updatedItem = await item.update({
        name,
        quantity,
        amount,
        buying_price,
        state,
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
  export const getDelete = async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Fetch all sold items from the database
      const allSoldItems = await VillageSolditems.findAll();
  
      // Find the index of the item to delete based on the itemId
      const itemIndex = allSoldItems.findIndex(item => item.id === parseInt(itemId, 10));
  
      if (itemIndex === -1) {
        // If item not found, return an error
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Get the item to delete from the database
      const itemToDelete = allSoldItems[itemIndex];
  
      // Delete the item from the database
      await itemToDelete.destroy();
  
      // Send a response confirming the deletion
      res.json({ message: 'Item successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }; 
  export const soldPerm = (req, res) => {
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

   