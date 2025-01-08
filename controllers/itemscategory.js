import db from '../models/index.js'

const { Itemscategory } =db;

export const Category = async(req,res)=>{
    try{
        const category = await Itemscategory.findAll()
        
        const formattedData =category.map(item=>({
            ...item.toJSON(),
            id:item.id,
            name:item.name,
            stock:item.in_stock,
            image_url:item.image_url,
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
    export const Categorydisplay = async(req,res)=>{
      try{
          const category = await Itemscategory.findAll()
          
          const formattedData =category.map(item=>({
              ...item.toJSON(),
              id:item.id,
              name:item.name,
              stock:item.in_stock,
              image_url:item.image_url,
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
    export const getcategoryItem = async (req, res) => {
        const { id } = req.params; 
        
        try {
          
          const item = await Itemscategory.findOne({
            where: { id },
          });
      
          if (!item) {
            return res.status(404).json({ error: 'Item not found' });
          }
      
          return res.json({
            id: item.id,
            name: item.name,
            in_stock: item.in_stock,
            created_at: item.created_at,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to fetch item details' });
        }
      };
     
      
      export const getcategoryUpdate = async (req, res) => {
        const { id } = req.params;
        const { name, in_stock, } = req.body;
      
        try {
          // Find the item first
          const item = await Itemscategory.findOne({
            where: { id },
          });
      
          if (!item) {
            return res.status(404).json({ error: 'Item not found' });
          }
      
          // Update the item
          const updatedItem = await item.update({
            name,
            in_stock,
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
      export const getcategoryDelete = async (req, res) => {
        const itemId = req.params.id;
      
        try {
          // Fetch all sold items from the database
          const allCategoryItems = await Itemscategory.findAll();
      
          // Find the index of the item to delete based on the itemId
          const itemIndex = allCategoryItems.findIndex(item => item.id === itemId);
      
          if (itemIndex === -1) {
            // If item not found, return an error
            return res.status(404).json({ message: 'Item not found' });
          }
      
          // Get the item to delete from the database
          const itemToDelete = allCategoryItems[itemIndex];
      
          // Delete the item from the database
          await itemToDelete.destroy();
      
          // Send a response confirming the deletion
          res.json({ message: 'Item successfully deleted' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };
      export const createCategory = async (req, res) => {
        const { name, in_stock } = req.body;
    
        try {
            // Validate input
            if (!name || typeof in_stock !== 'number') {
                return res.status(400).json({ error: 'Name and In Stock are required' });
            }
    
            // Create new category in the database
            const newCategory = await Itemscategory.create({
                name,
                in_stock,
            });
    
            return res.status(201).json({
                message: 'Category created successfully',
                category: newCategory.toJSON(),
            });
        } catch (error) {
            console.error('Error creating category:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
     