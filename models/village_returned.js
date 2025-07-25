import { DataTypes } from "sequelize";

export default(sequelize)=>{
    const VillageReturnedItems =sequelize.define("village_returned_items",{

        id:{
            type:DataTypes.STRING(36),
            allowNull:false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        sold_item_id:{
            type:DataTypes.STRING(36),
            allowNull:true,
            validate:{
                notEmpty: false
            }
        },
        category_id:{
          type:DataTypes.STRING,
          allowNull:true,
          foregnKey: true,
          validate:{
            notEmpty:false
          }
        },
        name:{
            type:DataTypes.STRING,
            allowNull:true,
            validate:{
                notEmpty:true
            }
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
            }
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        buying_price:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        state:{
            type:DataTypes.TINYINT,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        created_at:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW

        },
        updated_at:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue:DataTypes.NOW

        },deleted_at:
        {
            type:DataTypes.DATE,
            allowNull:true
        },
    },
    
        {
            tableName: "village_returned_items",
            timestamps: true,
            underscored: true   

    });

    return VillageReturnedItems
}