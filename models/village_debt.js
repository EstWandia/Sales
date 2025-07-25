import { DataTypes } from "sequelize";

export default(sequelize)=>{
    const VillageDebtitems =sequelize.define("village_debt_items",{

        id:{
            type:DataTypes.STRING(36),
            allowNull:false,
            primaryKey: true,
            validate:{
                notEmpty: true
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
        client_name:{
            type:DataTypes.STRING,
            allowNull:true,
            validate:{
                notEmpty:true
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
        amount_paid:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        amount_remaining:{
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
            tableName: "village_debt_items",
            timestamps: true,
            underscored: true   

    });

    return VillageDebtitems
}