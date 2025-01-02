import { DataTypes } from "sequelize";

export default(sequelize, dataTypes)=>{
    const Allitems =sequelize.define("all_items",{

        id:{
            type:DataTypes.STRING(36),
            allowNull:false,
            primaryKey:true,
            validate:{
                notEmpty: true
            }
        },
        items_category_id:{
            type:DataTypes.STRING(36),
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
         in_stock:{
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
        }
    },
        {
            tableName: "all_items",
            timestamps: true,
            underscored: true   

    });
    return Allitems
}